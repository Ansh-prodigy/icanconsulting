# 📧 Email Integration Setup Guide

## 🎯 **EmailJS Configuration Required**

To enable email notifications for form submissions, you need to set up EmailJS:

### **Step 1: Create EmailJS Account**
1. Go to [emailjs.com](https://emailjs.com)
2. Sign up for a free account
3. Verify your email address

### **Step 2: Create Email Service**
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** or your preferred email provider
4. Connect your email account (Arunn.desikan@gmail.com)
5. Note down the **Service ID**

### **Step 3: Create Email Templates**

#### **Template 1: Notification to Arun**
**Template Name**: `booking_notification`
**Subject**: `New I-Can Consulting Booking Request`
**Content**:
```
Hello Arun,

You have received a new booking request:

Name: {{from_name}}
Email: {{from_email}}
Session Type: {{session_type}}
Industry: {{industry}}
Career Goals: {{career_goals}}
Current Challenges: {{current_challenges}}
Specific Questions: {{specific_questions}}
Preferred Days: {{preferred_days}}
Scheduled Time: {{scheduled_time}}

Please review and confirm this booking.

Best regards,
I-Can Consulting System
```

#### **Template 2: Acknowledgment to Client**
**Template Name**: `booking_acknowledgment`
**Subject**: `Your I-Can Consulting Session Confirmation`
**Content**:
```
Dear {{to_name}},

Thank you for booking a session with I-Can Consulting!

Session Details:
- Session Type: {{session_type}}
- Scheduled Time: {{scheduled_time}}

Arun will review your request and send you detailed preparation materials within 24 hours.

If you have any questions, please contact us at Arunn.desikan@gmail.com

Best regards,
Arun Desikan
I-Can Consulting
```

### **Step 4: Update the Website Code**

Replace the placeholder values in `icanconsulting.html`:

```javascript
// Replace these values in the JavaScript section:
emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Your EmailJS public key

// In the sendNotificationEmail function:
await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    // ... template variables
});

await emailjs.send("YOUR_SERVICE_ID", "YOUR_ACKNOWLEDGMENT_TEMPLATE_ID", {
    // ... template variables
});
```

### **Step 5: Get Your EmailJS Credentials**

1. **Public Key**: Go to EmailJS dashboard → **Account** → **API Keys**
2. **Service ID**: From the Email Service you created
3. **Template IDs**: From the Email Templates you created

### **Step 6: Test the Integration**

1. Update the code with your actual credentials
2. Submit a test booking form
3. Check both email addresses for notifications

## 🔧 **Alternative Email Solutions**

### **Option 1: Formspree**
If EmailJS setup is complex, you can use Formspree:

1. Go to [formspree.io](https://formspree.io)
2. Create a new form
3. Replace the form action with your Formspree endpoint
4. Add hidden fields for email notifications

### **Option 2: Netlify Forms**
If hosting on Netlify:

1. Add `netlify` attribute to the form
2. Configure form notifications in Netlify dashboard
3. Set up email notifications to Arunn.desikan@gmail.com

## 📋 **Current Email Configuration**

### **Notification Recipients:**
- **Primary**: Arunn.desikan@gmail.com (Arun)
- **Client**: Form submitter's email address

### **Email Content:**
- **To Arun**: Complete booking details and client information
- **To Client**: Confirmation and next steps

## ✅ **Features Implemented:**

1. ✅ **LinkedIn Profile**: Updated to https://www.linkedin.com/in/arundesikan
2. ✅ **Calendly Integration**: Added inline widget and popup button
3. ✅ **Email Notifications**: EmailJS integration ready for setup
4. ✅ **Contact Information**: Updated to Arunn.desikan@gmail.com
5. ✅ **Form Processing**: Enhanced with email functionality

## 🚀 **Next Steps:**

1. **Set up EmailJS** with the credentials above
2. **Test the email functionality** with a sample booking
3. **Verify Calendly integration** works correctly
4. **Deploy the updated website**

---

**Your I-Can Consulting website now has full email notification and Calendly integration!** 🎉