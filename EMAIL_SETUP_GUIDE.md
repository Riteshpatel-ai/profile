# 📧 EmailJS Setup Guide for Portfolio Contact Form

## 🎯 Overview
Your portfolio contact form is now integrated with EmailJS to send messages directly to **Ritesh9878patel@gmail.com**. Follow this guide to complete the setup.

## 🚀 Quick Setup Steps

### Step 1: Create EmailJS Account
1. Visit [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Connect Gmail Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **"Add New Service"**
3. Select **"Gmail"** 
4. Click **"Connect Account"** and login with `Ritesh9878patel@gmail.com`
5. Grant permissions to EmailJS
6. Copy your **Service ID** (e.g., `service_xyz123`)

### Step 3: Create Email Template
1. Go to **Email Templates** in the dashboard
2. Click **"Create New Template"**
3. Use this template content:

**Subject Line:**
```
Portfolio Contact: {{subject}}
```

**Email Body:**
```html
Hello Ritesh,

You have received a new message from your portfolio website!

---
👤 From: {{user_name}}
📧 Email: {{user_email}}
📋 Subject: {{subject}}

💬 Message:
{{message}}

---
📅 Received: {{current_date}}
🌐 Sent from: your-portfolio-website.com

Reply directly to this email to respond to {{user_name}}.
```

4. Save the template and copy the **Template ID** (e.g., `template_abc456`)

## 🔧 IMPORTANT: Fix "From" and "To" Email Issue

### Problem
If your emails show the same "from" and "to" address, update your template variables:

### ✅ **MAIN TEMPLATE CONFIGURATION** (template_vioytzq)

**Subject Line:**
```
New inquiry from {{name}}: {{subject}}
```

**Email Body:**
```
Hello Ritesh,

You have received a new message via the Contact Us form on your website.

Details:
Name: {{name}}
Email: {{email}}
Submitted At: {{time}}
Subject: {{subject}}

Message:
{{message}}

Please respond to the sender at {{email}} at your earliest convenience.
```

### ✅ **AUTO-REPLY TEMPLATE CONFIGURATION** (template_92vcqga)

**Subject:**
```
Thank you for contacting Ritesh Patel
```

**Email Body:**
```
Dear {{name}},

Thank you for reaching out to me via the Contact Form on my website.

I have successfully received your message with the subject "{{subject}}" submitted on {{time}}. I will review your inquiry and respond to you at your email address ({{email}}) as soon as possible, typically within 24 hours.

If you have any additional questions, please feel free to reply to this email.

Best regards,
Ritesh Patel
Software Engineer
```

### ⚙️ **EmailJS Dashboard Settings:**

1. **Main Template (template_vioytzq):**
   - **To Email:** ritesh9878patel@gmail.com
   - **From Name:** {{name}}
   - **From Email:** {{email}} 
   - **Reply To:** {{email}}

2. **Auto-Reply Template (template_92vcqga):**
   - **To Email:** {{email}}
   - **From Name:** Ritesh Patel
   - **From Email:** ritesh9878patel@gmail.com
   - **Reply To:** ritesh9878patel@gmail.com

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `user_def789ghi012`)

### Step 5: Update Your Website Code
Open `script.js` and replace these values in the `ContactManager` class:

```javascript
// Find around line 650 and replace:
this.emailConfig = {
    publicKey: 'your_actual_public_key_here',
    serviceId: 'your_actual_service_id_here', 
    templateId: 'your_actual_template_id_here'
};
```

**Example after configuration:**
```javascript
this.emailConfig = {
    publicKey: 'user_def789ghi012',
    serviceId: 'service_xyz123',
    templateId: 'template_abc456'
};
```

## 🎨 Visual Confirmation
After updating the keys, the blue notice on your contact form will change from:
- 📧 **"Contact form ready! Complete EmailJS setup..."** (before setup)
- ✅ **"Email functionality active! Messages will be sent to Ritesh9878patel@gmail.com"** (after setup)

## 🧪 Testing Your Setup

### Test the Contact Form:
1. Open your portfolio website
2. Fill out the contact form with test data:
   - **Name:** Test User
   - **Email:** your.test@email.com
   - **Subject:** Test Message
   - **Message:** This is a test message from my portfolio.
3. Click **"Send Message"**
4. Check your Gmail (`Ritesh9878patel@gmail.com`) for the email

### Troubleshooting:
- **Form shows "loading" forever**: Check browser console for errors
- **No email received**: Verify Service ID and Template ID are correct
- **"EmailJS not configured" in console**: Double-check Public Key
- **Gmail login issues**: Ensure you're using the correct Gmail account

## 📊 EmailJS Free Plan Benefits
- ✅ **200 emails/month** (perfect for portfolio)
- ✅ **2 email services**
- ✅ **Unlimited templates**
- ✅ **Email delivery tracking**
- ✅ **No credit card required**

## 🔧 Advanced Configuration

### Custom Email Template Variables
Your template can use these variables:
- `{{from_name}}` - Visitor's full name
- `{{from_email}}` - Visitor's email address  
- `{{subject}}` - Selected subject
- `{{message}}` - Message content
- `{{current_date}}` - Submission timestamp
- `{{reply_to}}` - Reply-to email address

### Email Notifications
To get instant notifications:
1. Enable Gmail push notifications on your phone
2. Add a filter in Gmail for emails from EmailJS
3. Set up a special label for portfolio contacts

### Spam Protection
Built-in features include:
- ✅ Form validation before submission
- ✅ Rate limiting (prevents rapid submissions)
- ✅ EmailJS spam filtering
- ✅ Captcha integration (premium feature)

## 🚨 Security Notes
- Your EmailJS keys are safe to use in frontend code
- EmailJS handles all email authentication securely
- No sensitive credentials are exposed
- Rate limiting prevents abuse

## 🔄 Alternative Email Services
If you prefer other solutions:

### Option 1: Formspree
- Simple form handling service
- Direct email forwarding
- Easy setup with just an email address

### Option 2: Netlify Forms (if hosting on Netlify)
- Built-in form handling
- Automatic spam filtering
- Integrates with Netlify deployments

### Option 3: Custom Backend
- Node.js with Nodemailer
- More control but requires server setup
- Good for advanced requirements

## 📈 Usage Analytics
EmailJS provides:
- 📊 Email delivery statistics
- 📈 Monthly usage tracking  
- 🔍 Error logs and debugging info
- 📱 Real-time delivery status

## 💡 Pro Tips
1. **Test thoroughly** before going live
2. **Set up email filters** in Gmail for organization
3. **Monitor your monthly quota** in EmailJS dashboard
4. **Keep your Service/Template IDs secure** (though they're not sensitive)
5. **Set up auto-responders** for better user experience

## 🆘 Support
- **EmailJS Documentation**: [docs.emailjs.com](https://docs.emailjs.com)
- **Community Forum**: EmailJS community support
- **Email Support**: Available on paid plans

---

## ✅ Quick Checklist
- [ ] EmailJS account created
- [ ] Gmail service connected
- [ ] Email template created and saved
- [ ] Public Key, Service ID, and Template ID copied
- [ ] JavaScript file updated with actual keys
- [ ] Contact form tested successfully
- [ ] Email received in Ritesh9878patel@gmail.com
- [ ] Form notice shows "Email functionality active"

**Once complete, your portfolio contact form will be fully functional! 🚀**

---

*Need help? The contact form implementation includes comprehensive error handling and user feedback to ensure a smooth experience for your portfolio visitors.*
