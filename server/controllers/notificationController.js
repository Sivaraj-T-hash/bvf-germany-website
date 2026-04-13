import { auth, rtdb } from '../firebaseAdmin.js';
import { sendAdminBroadcastEmails, sendFormSubmissionEmails } from '../services/mailService.js';

const allowedTypes = new Set(['contact', 'booking', 'webinar']);

function requireString(value) {
  return String(value || '').trim();
}

function validatePayload(formType, payload) {
  if (!allowedTypes.has(formType)) {
    return 'Invalid form type.';
  }

  if (!payload.name || !payload.email) {
    return 'Name and email are required.';
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

  return '';
}

export async function sendSubmissionEmails(req, res) {
  try {
    const formType = requireString(req.body.formType);
    const payload = {
      name: requireString(req.body.name),
      email: requireString(req.body.email).toLowerCase(),
      phone: requireString(req.body.phone),
      message: requireString(req.body.message),
      preferredDate: requireString(req.body.preferredDate),
      preferredTime: requireString(req.body.preferredTime),
      notes: requireString(req.body.notes),
      webinarTitle: requireString(req.body.webinarTitle),
      webinarDate: requireString(req.body.webinarDate),
      qualification: requireString(req.body.qualification),
      intake: requireString(req.body.intake),
      planningYear: requireString(req.body.planningYear),
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
