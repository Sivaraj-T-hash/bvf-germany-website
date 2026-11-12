import { auth, rtdb } from '../firebaseAdmin.js';
import { sendAdminBroadcastEmails, sendFormSubmissionEmails } from '../services/mailService.js';

const allowedTypes = new Set(['contact', 'booking', 'webinar', 'profile_evaluation', 'pricing', 'tool', 'order']);
const allowedLeadSources = new Set(['contact', 'pricing', 'tool']);
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function requireString(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function sanitizeMetadata(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, entry]) => [String(key).trim(), requireString(entry)])
      .filter(([key, entry]) => key && entry),
  );
}

function validatePayload(formType, payload) {
  if (!allowedTypes.has(formType)) {
    return 'Invalid form type.';
  }

  if (!payload.name || !payload.email) {
    return 'Name and email are required.';
  }

  if (!EMAIL_PATTERN.test(payload.email)) {
    return 'A valid email address is required.';
  }

  if (formType === 'order' && (!payload.orderTitle || !payload.orderId)) {
    return 'Order details are required.';
  }

  if (formType === 'contact' && !payload.message) {
    return 'Message is required for contact form.';
  }

  if (formType === 'booking' && (!payload.preferredDate || !payload.preferredTime)) {
    return 'Preferred date and time are required for booking form.';
  }

  if (formType === 'webinar' && !payload.webinarTitle) {
    return 'Webinar title is required for webinar form.';
  }

  if (formType === 'profile_evaluation' && (!payload.interestedProgram || !payload.currentEducation)) {
    return 'Interested program and current education are required for profile evaluation.';
  }

  return '';
}

export async function sendSubmissionEmails(req, res) {
  try {
    const formType = requireString(req.body.formType);
    const payload = {
      name: requireString(req.body.name, 120),
      email: requireString(req.body.email, 254).toLowerCase(),
      phone: requireString(req.body.phone, 30),
      message: requireString(req.body.message, 2000),
      preferredDate: requireString(req.body.preferredDate, 20),
      preferredTime: requireString(req.body.preferredTime, 20),
      notes: requireString(req.body.notes, 2000),
      webinarTitle: requireString(req.body.webinarTitle, 200),
      webinarDate: requireString(req.body.webinarDate, 60),
      qualification: requireString(req.body.qualification, 100),
      intake: requireString(req.body.intake, 50),
      planningYear: requireString(req.body.planningYear, 10),
      selectedPackage: requireString(req.body.selectedPackage, 120),
      source: requireString(req.body.source, 200),
      orderTitle: requireString(req.body.orderTitle, 200),
      amountLabel: requireString(req.body.amountLabel, 40),
      orderId: requireString(req.body.orderId, 60),
      subject: requireString(req.body.subject, 200),
      interestedProgram: requireString(req.body.interestedProgram, 200),
      currentEducation: requireString(req.body.currentEducation, 200),
    };

    const validationError = validatePayload(formType, payload);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    await sendFormSubmissionEmails(formType, payload);

    return res.json({ success: true, message: 'Notification emails sent.' });
  } catch (error) {
    console.error('sendSubmissionEmails failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to send notification emails.' });
  }
}

async function createLeadRecord(payload) {
  const leadRef = rtdb.ref('leads').push();
  const lead = {
    id: leadRef.key || `lead_${Date.now()}`,
    source: payload.source,
    sourcePage: payload.sourcePage,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || '',
    subject: payload.subject,
    message: payload.message,
    ownerType: 'public',
    userId: null,
    studentEmail: payload.email,
    metadata: payload.metadata,
    status: 'new',
    createdAt: new Date().toISOString(),
    ...(payload.consentAt ? { consentAt: payload.consentAt } : {}),
  };

  await leadRef.set(lead);
  return lead;
}

export async function sendPublicLeadSubmission(req, res) {
  try {
    const website = requireString(req.body.website);
    if (website) {
      return res.status(400).json({ success: false, message: 'Invalid submission.' });
    }

    const formType = requireString(req.body.formType);
    const source = requireString(req.body.source) || 'contact';
    if (!allowedLeadSources.has(source)) {
      return res.status(400).json({ success: false, message: 'Invalid lead source.' });
    }

    const payload = {
      source,
      sourcePage: requireString(req.body.sourcePage, 200) || '/',
      name: requireString(req.body.name, 120),
      email: requireString(req.body.email, 254).toLowerCase(),
      phone: requireString(req.body.phone, 30),
      subject: requireString(req.body.subject, 200),
      message: requireString(req.body.message, 2000),
      interestedProgram: requireString(req.body.interestedProgram, 200),
      currentEducation: requireString(req.body.currentEducation, 200),
      metadata: sanitizeMetadata(req.body.metadata),
      consentAt: requireString(req.body.consentAt, 40),
    };

    const validationError = validatePayload(formType, payload);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const lead = await createLeadRecord(payload);

    let emailSent = true;
    try {
      await sendFormSubmissionEmails(formType, payload);
    } catch (error) {
      emailSent = false;
      console.error('sendPublicLeadSubmission email failed:', error);
    }

    return res.json({
      success: true,
      message: emailSent ? 'Lead submitted successfully.' : 'Lead saved successfully, but email delivery failed.',
      emailSent,
      leadId: lead.id,
    });
  } catch (error) {
    console.error('sendPublicLeadSubmission failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to save lead submission.' });
  }
}

async function verifyAdmin(req) {
  const idToken = String(req.body.idToken || '').trim();
  if (!idToken) return null;

  const decoded = await auth.verifyIdToken(idToken);
  if (!decoded?.uid) return null;

  const adminSnapshot = await rtdb.ref(`admins/${decoded.uid}`).get();
  if (!adminSnapshot.exists()) return null;
  const adminProfile = adminSnapshot.val();
  if (!adminProfile?.isAdmin) return null;

  return { decoded, adminProfile };
}

export async function sendAdminBroadcast(req, res) {
  try {
    const adminContext = await verifyAdmin(req);
    if (!adminContext) {
      return res.status(401).json({ success: false, message: 'Unauthorized admin request.' });
    }
    const { decoded, adminProfile } = adminContext;

    const eventType = requireString(req.body.eventType);
    if (eventType !== 'blog' && eventType !== 'webinar') {
      return res.status(400).json({ success: false, message: 'Invalid event type.' });
    }

    const title = requireString(req.body.title);
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    const ctaUrl = requireString(req.body.ctaUrl);
    const testOnly = Boolean(req.body.testOnly);
    const studentSnapshot = await rtdb.ref('students').get();
    const students = studentSnapshot.val() || {};

    const allStudentRecipients = Object.values(students)
      .filter((student) => student?.email)
      .map((student) => String(student.email));
    const adminEmail = String(decoded.email || adminProfile?.email || '').trim().toLowerCase();
    const recipients = testOnly ? (adminEmail ? [adminEmail] : []) : allStudentRecipients;

    const subject =
      eventType === 'blog'
        ? `New blog from BVF Germany: ${title}`
        : `New webinar from BVF Germany: ${title}`;
    const message =
      eventType === 'blog'
        ? `${title} has been published. Read it now in the BVF Germany blog section.`
        : `${title} has been posted. Check the BVF Germany webinars section to register.`;
    const ctaLabel = eventType === 'blog' ? 'Read blog' : 'View webinar';

    const result = await sendAdminBroadcastEmails({
      recipients,
      subject,
      title,
      message,
      ctaUrl,
      ctaLabel,
    });

    return res.json({
      success: true,
      message: testOnly ? `Test email sent to admin (${result.sent}).` : `Broadcast sent to ${result.sent} students.`,
      sent: result.sent,
    });
  } catch (error) {
    console.error('sendAdminBroadcast failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to send broadcast emails.' });
  }
}
