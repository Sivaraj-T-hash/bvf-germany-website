import { get, onValue, push, ref, set, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DB_PATHS } from '@/lib/dbPaths';
import { addStudentTimelineEvent } from '@/lib/studentStore';

export type OrderStatus = 'pending' | 'paid' | 'cancelled';
export type OrderItemType = 'plan' | 'webinar';

export interface OrderRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  itemType: OrderItemType;
  itemId: string;
  title: string;
  amountLabel: string;
  amountValue: number;
  status: OrderStatus;
  paymentMode: 'manual-pending';
  resourceDriveUrl?: string | null;
  resourceDriveLabel?: string | null;
  resourceDeliveredAt?: string | null;
  resourceDeliveredBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

const ORDERS_PATH = DB_PATHS.orders;

export const parseAmountValue = (input: string): number => {
  const normalized = input.replace(/[^\d.]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export async function createOrder(
  input: Omit<OrderRecord, 'id' | 'status' | 'paymentMode' | 'createdAt' | 'updatedAt'>,
): Promise<OrderRecord> {
  const orderRef = push(ref(db, ORDERS_PATH));
  const timestamp = new Date().toISOString();
  const order: OrderRecord = {
    id: orderRef.key || crypto.randomUUID(),
    status: 'pending',
    paymentMode: 'manual-pending',
    resourceDriveUrl: null,
    resourceDriveLabel: null,
    resourceDeliveredAt: null,
    resourceDeliveredBy: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  };

  await set(orderRef, order);

  if (input.userId) {
    try {
      await addStudentTimelineEvent(
        input.userId,
        'Resource order placed',
        `Placed order for ${order.title} (${order.amountLabel}).`,
        'system',
      );
    } catch (error) {
      console.warn('Order saved but timeline event failed', error);
    }
  }

  return order;
}

export async function getOrdersByEmail(email: string): Promise<OrderRecord[]> {
  const snapshot = await get(ref(db, ORDERS_PATH));
  if (!snapshot.exists()) return [];

  const orders = snapshot.val() as Record<string, OrderRecord>;
  return Object.values(orders)
    .filter((order) => order.email === email)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function subscribeToOrders(callback: (orders: OrderRecord[]) => void): () => void {
  return onValue(ref(db, ORDERS_PATH), (snapshot) => {
    const orders = (snapshot.val() || {}) as Record<string, OrderRecord>;
    callback(
      Object.values(orders).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  });
}

export async function updateOrderStatus(
  orderId: string,
  patch: Pick<OrderRecord, 'status'> & Partial<Pick<OrderRecord, 'amountLabel'>>,
): Promise<void> {
  const snapshot = await get(ref(db, `${ORDERS_PATH}/${orderId}`));
  const existing = snapshot.exists() ? (snapshot.val() as OrderRecord) : null;

  await update(ref(db, `${ORDERS_PATH}/${orderId}`), {
    ...patch,
    updatedAt: new Date().toISOString(),
  });

  if (existing?.userId && patch.status === 'paid') {
    try {
      await addStudentTimelineEvent(
        existing.userId,
        'Payment successful',
        `Payment completed for ${existing.title}.`,
        'system',
      );
    } catch (error) {
      console.warn('Order updated but payment timeline event failed', error);
    }
  }
}

export async function updateOrderResourceAccess(
  orderId: string,
  patch: {
    resourceDriveUrl: string | null;
    resourceDriveLabel?: string | null;
    resourceDeliveredBy?: string | null;
  },
): Promise<void> {
  const snapshot = await get(ref(db, `${ORDERS_PATH}/${orderId}`));
  const existing = snapshot.exists() ? (snapshot.val() as OrderRecord) : null;
  const deliveredAt = patch.resourceDriveUrl ? new Date().toISOString() : null;

  await update(ref(db, `${ORDERS_PATH}/${orderId}`), {
    resourceDriveUrl: patch.resourceDriveUrl,
    resourceDriveLabel: patch.resourceDriveLabel ?? null,
    resourceDeliveredBy: patch.resourceDeliveredBy ?? null,
    resourceDeliveredAt: deliveredAt,
    updatedAt: new Date().toISOString(),
  });

  if (existing?.userId && patch.resourceDriveUrl) {
    try {
      await addStudentTimelineEvent(
        existing.userId,
        'Resource access delivered',
        `Your purchase ${existing.title} is ready in Google Drive.`,
        'system',
      );
    } catch (error) {
      console.warn('Resource access updated but timeline event failed', error);
    }
  }
}
