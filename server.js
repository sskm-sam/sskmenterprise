require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { parse } = require('csv-parse/sync');

const app = express();
const PORT = process.env.PORT || 3000;
const consultantDatabasePath = path.join(__dirname, 'data', 'consultants.json');
const consultantUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 } });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true,
  lastModified: true
}));

const siteData = {
  companyName: "SSKM ENTERPRISE SOLUTIONS & MEDIA INC.",
  tagline: "Enterprise Technology & SAP Transformation Consulting across North America.",
  address: "710-365 Prince of Wales Drive, Mississauga, Ontario, Canada L5B 0G6",
  adsensePublisherId: process.env.ADSENSE_PUBLISHER_ID || '',
  linkedinCompanyUrl: process.env.LINKEDIN_COMPANY_URL || 'https://www.linkedin.com/',
  googleAnalyticsId: /^G-[A-Z0-9]+$/i.test(process.env.GOOGLE_ANALYTICS_ID || '') ? process.env.GOOGLE_ANALYTICS_ID : ''
};

function readConsultants() {
  return JSON.parse(fs.readFileSync(consultantDatabasePath, 'utf8'));
}

function saveConsultant(consultant) {
  const consultants = readConsultants();
  consultants.push(consultant);
  fs.writeFileSync(consultantDatabasePath, JSON.stringify(consultants, null, 2) + '\n');
}

// Transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.sskmenterprise.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 1. Home
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Enterprise Technology Consulting, Training & Digital Media', 
    metaDescription: 'SSKM combines SAP and enterprise architecture consulting, professional training, coaching, and digital media solutions for organizations across Canada and the United States.',
    currentPath: '/',
    siteData 
  });
});

// 2. High-Intent Services
app.get('/services/sap-s4hana', (req, res) => {
  res.render('sap-s4hana', { 
    title: 'SAP S/4HANA Migration & Transformation Consulting', 
    metaDescription: 'De-risk your SAP S/4HANA roadmap with proven enterprise architecture assessments and clean core governance.',
    currentPath: '/services/sap-s4hana',
    siteData 
  });
});

app.get('/services/sap-btp', (req, res) => {
  res.render('sap-btp', { 
    title: 'SAP BTP Consulting & Cloud Platform Extensions', 
    metaDescription: 'Build side-by-side extensions, automate workflows, and federate identity on SAP Business Technology Platform (BTP).',
    currentPath: '/services/sap-btp',
    siteData 
  });
});

app.get('/services/sap-integration', (req, res) => {
  res.render('sap-integration', { 
    title: 'SAP Integration Suite & CPI Consulting', 
    metaDescription: 'Migrate from SAP PO/PI to SAP Cloud Integration (CPI) with scalable API management and EDI architectures.',
    currentPath: '/services/sap-integration',
    siteData 
  });
});

app.get('/services/enterprise-integration', (req, res) => {
  res.render('enterprise-integration', {
    title: 'Enterprise Integration, Middleware, APIs & EDI',
    metaDescription: 'Connect enterprise applications, middleware, APIs, and EDI/B2B trading partners with reliable integration architecture.',
    currentPath: '/services/enterprise-integration',
    siteData
  });
});

app.get('/services/enterprise-architecture', (req, res) => {
  res.render('enterprise-architecture', { 
    title: 'Enterprise Architecture Consulting & CIO Advisory', 
    metaDescription: 'Align business strategy with technology execution using TOGAF architecture assessments and technical due diligence.',
    currentPath: '/services/enterprise-architecture',
    siteData 
  });
});

app.get(['/training', '/resources', '/courses'], (req, res) => {
  res.render('resources', {
    title: req.path === '/courses' ? 'SAP & Enterprise Architecture Courses | SSKM' : 'SAP, Integration & Enterprise Technology Training | SSKM',
    metaDescription: 'Explore SAP CPI, Integration Suite, enterprise architecture, solution architect, and professional coaching programs for technology professionals and client teams.',
    currentPath: req.path,
    siteData
  });
});

// 3. Case Studies & North America
app.get('/case-studies', (req, res) => {
  res.render('case-studies', { 
    title: 'Enterprise Case Studies & Transformations', 
    metaDescription: 'Review enterprise technology transformation examples across SAP, integration, architecture, and digital delivery.',
    currentPath: '/case-studies',
    siteData 
  });
});

app.get('/north-america', (req, res) => {
  res.render('north-america', { 
    title: 'Enterprise Consulting Across North America (Canada & USA)', 
    metaDescription: 'SSKM delivers enterprise technology consulting, SAP transformation, integration, and architecture services across Canada and the United States.',
    currentPath: '/north-america',
    siteData 
  });
});

app.get('/management', (req, res) => {
  res.render('management', {
    title: 'Executive Management',
    metaDescription: 'Meet the leadership team guiding SSKM Enterprise Solutions & Media Inc. across enterprise consulting, operations, training, and media services.',
    currentPath: '/management',
    siteData
  });
});

// 4. Other Standard Pages
app.get('/about', (req, res) => res.render('about', {
  title: 'About SSKM Enterprise Solutions & Media Inc.',
  metaDescription: 'Learn about SSKM Enterprise Solutions & Media Inc., an Ontario enterprise technology and creative media company serving Canada and the United States.',
  currentPath: '/about',
  siteData
}));
app.get('/industries', (req, res) => res.render('industries', {
  title: 'Industries Served by SSKM Enterprise',
  metaDescription: 'Explore the industries supported by SSKM through SAP transformation, enterprise integration, architecture, training, and digital delivery.',
  currentPath: '/industries',
  siteData
}));
app.get('/insights', (req, res) => res.render('insights', {
  title: 'Enterprise Technology Insights | SSKM',
  metaDescription: 'Read SSKM insights on SAP transformation, enterprise integration, architecture, APIs, EDI, and digital delivery.',
  currentPath: '/insights',
  siteData
}));
app.get('/careers', (req, res) => res.render('careers', {
  title: 'Independent Consultant Careers | SSKM Enterprise',
  metaDescription: 'Build a trusted team of independent SAP, integration, middleware, API, data, and NoSQL consultants with SSKM Enterprise Solutions & Media Inc.',
  currentPath: '/careers',
  siteData,
  submitted: false,
  error: false,
  importEnabled: Boolean(process.env.CONSULTANT_IMPORT_TOKEN),
  imported: Number(req.query.imported) || 0,
  skipped: Number(req.query.skipped) || 0,
  importError: req.query.importError === '1',
  openings: [
    {
      division: 'Enterprise Solutions',
      type: 'Independent Consultant',
      location: 'Remote / Hybrid / North America',
      title: 'SAP Integration Consultant',
      summary: 'Hands-on SAP integration and enterprise architecture specialist for middleware, API, BTP, and SAP-to-non-SAP transformation programs.'
    },
    {
      division: 'Enterprise Solutions',
      type: 'Fractional Lead',
      location: 'Remote / Client Site',
      title: 'Technical Solution Architect',
      summary: 'Lead design and delivery for enterprise integration, solution architecture, EDI, and cross-platform modernization initiatives.'
    },
    {
      division: 'Enterprise Solutions',
      type: 'Independent Specialist',
      location: 'Remote / Global',
      title: 'API, Middleware & NoSQL Consultant',
      summary: 'Support modern data and integration platforms including API management, event-driven systems, NoSQL data stores, and scalable application integration patterns.'
    },
    {
      division: 'Enterprise Solutions',
      type: 'Project-Based',
      location: 'Remote / Client Site',
      title: 'EDI & B2B Integration Specialist',
      summary: 'Coordinate business-to-business integration designs for EDI, partner connectivity, application workflows, and operational integration services.'
    }
  ]
}));

app.get('/consultant-template.csv', (req, res) => {
  res.type('text/csv').send('name,email,phone,location,expertise,experience,availability,profile,consent\nJane Doe,jane@example.com,555-0100,Ontario / EST,"SAP CPI; API Management",15 years,"Part time","SAP integration architect with BTP and EDI experience",yes\n');
});

app.post('/admin/consultants/import', consultantUpload.single('consultantCsv'), (req, res) => {
  if (!process.env.CONSULTANT_IMPORT_TOKEN || req.body.importToken !== process.env.CONSULTANT_IMPORT_TOKEN || !req.file) {
    return res.redirect('/careers?importError=1');
  }

  try {
    const rows = parse(req.file.buffer.toString('utf8'), { columns: true, skip_empty_lines: true, trim: true, bom: true });
    const consultants = readConsultants();
    const existingEmails = new Set(consultants.map(consultant => consultant.email.toLowerCase()));
    let imported = 0;
    let skipped = 0;

    rows.forEach(row => {
      const requiredFields = ['name', 'email', 'location', 'expertise', 'experience', 'availability', 'profile'];
      if (!requiredFields.every(field => row[field]) || String(row.consent).toLowerCase() !== 'yes' || existingEmails.has(row.email.toLowerCase())) {
        skipped += 1;
        return;
      }
      const timestamp = new Date().toISOString();
      consultants.push({
        id: `consultant-${Date.now()}-${imported}`,
        name: row.name,
        email: row.email,
        phone: row.phone || '',
        location: row.location,
        expertise: row.expertise,
        experience: row.experience,
        availability: row.availability,
        profile: row.profile,
        consent: true,
        consentAt: timestamp,
        submittedAt: timestamp,
        status: 'new',
        source: 'csv-import'
      });
      existingEmails.add(row.email.toLowerCase());
      imported += 1;
    });

    fs.writeFileSync(consultantDatabasePath, JSON.stringify(consultants, null, 2) + '\n');
    res.redirect(`/careers?imported=${imported}&skipped=${skipped}`);
  } catch (err) {
    console.error('Consultant CSV import failed:', err);
    res.redirect('/careers?importError=1');
  }
});

app.post('/consultant-application', async (req, res) => {
  const { name, email, phone, location, expertise, experience, availability, profile, consent } = req.body;
  if (!consent) {
    return res.render('careers', { title: 'Independent Consultant Careers | SSKM Enterprise', metaDescription: 'Build a trusted team of independent SAP, integration, middleware, API, data, and NoSQL consultants with SSKM Enterprise Solutions & Media Inc.', currentPath: '/careers', siteData, submitted: false, error: true, importEnabled: Boolean(process.env.CONSULTANT_IMPORT_TOKEN), imported: 0, skipped: 0, importError: false, openings: [] });
  }
  const consultant = {
    id: `consultant-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : '',
    location: location.trim(),
    expertise: expertise.trim(),
    experience: experience.trim(),
    availability: availability.trim(),
    profile: profile.trim(),
    consent: true,
    consentAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    status: 'new'
  };

  try {
    saveConsultant(consultant);
    try {
      await transporter.sendMail({
        from: `"Consultant Network" <${process.env.EMAIL_USER}>`,
        replyTo: consultant.email,
        to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
        subject: `Consultant Network Application: ${consultant.name}`,
        text: `Name: ${consultant.name}\nEmail: ${consultant.email}\nPhone: ${consultant.phone}\nLocation: ${consultant.location}\nExpertise: ${consultant.expertise}\nExperience: ${consultant.experience}\nAvailability: ${consultant.availability}\n\nProfile:\n${consultant.profile}`
      });
    } catch (mailError) {
      console.error('Consultant profile saved, but notification email failed:', mailError);
    }
    res.render('careers', { title: 'Independent Consultant Careers | SSKM Enterprise', metaDescription: 'Build a trusted team of independent SAP, integration, middleware, API, data, and NoSQL consultants with SSKM Enterprise Solutions & Media Inc.', currentPath: '/careers', siteData, submitted: true, error: false, importEnabled: Boolean(process.env.CONSULTANT_IMPORT_TOKEN), imported: 0, skipped: 0, importError: false, openings: [] });
  } catch (err) {
    console.error(err);
    res.render('careers', { title: 'Independent Consultant Careers | SSKM Enterprise', metaDescription: 'Build a trusted team of independent SAP, integration, middleware, API, data, and NoSQL consultants with SSKM Enterprise Solutions & Media Inc.', currentPath: '/careers', siteData, submitted: false, error: true, importEnabled: Boolean(process.env.CONSULTANT_IMPORT_TOKEN), imported: 0, skipped: 0, importError: false, openings: [] });
  }
});
app.get('/privacy-policy', (req, res) => res.render('privacy-policy', { title: 'Privacy Policy', currentPath: '/privacy-policy', noIndex: true, siteData }));
app.get('/disclaimer', (req, res) => res.render('disclaimer', { title: 'Disclaimer', currentPath: '/disclaimer', noIndex: true, siteData }));
app.get('/copyright', (req, res) => res.render('copyright', { title: 'Copyright Notice', currentPath: '/copyright', noIndex: true, siteData }));
app.get('/terms-and-conditions', (req, res) => res.render('terms-and-conditions', { title: 'Terms & Conditions', currentPath: '/terms-and-conditions', noIndex: true, siteData }));

// 5. Separated Media Services
app.get('/media-services', (req, res) => {
  const mediaServices = [
    { title: "Film & Content Production", icon: "fas fa-film", description: "Feature films and scripted series.", tags: ["Screenwriting", "Direction"] },
    { title: "Post-Production & Sound Mastering", icon: "fas fa-sliders-h", description: "DaVinci Resolve color grading and audio mastering.", tags: ["Color Grading", "Audio Mastering"] }
  ];
  const youtubeChannels = [
    { name: "Satya Cine Studios", handle: "@SatyaCineStudio", url: "https://www.youtube.com/@SatyaCineStudio", category: "Cinema", badge: "Banner", description: "Original short films and cinematic trailers.", highlight: "Film Releases", icon: "fa-solid fa-clapperboard" },
    { name: "Satya Food Travel Vlogs", handle: "@satyafoodtravelvlogs", url: "https://www.youtube.com/@satyafoodtravelvlogs", category: "Food & Travel", badge: "Vlog Channel", description: "Food discoveries, travel experiences, and personal vlogs from destinations and local communities.", highlight: "Food & Travel Stories", icon: "fa-solid fa-utensils" }
  ];
  res.render('media', {
    title: 'Media Services, Film Production & YouTube Channels',
    metaDescription: 'Explore SSKM film production, post-production, sound mastering, and YouTube channels including Satya Cine Studios and Satya Food Travel Vlogs.',
    currentPath: '/media-services',
    siteData,
    services: mediaServices,
    channels: youtubeChannels
  });
});

// 6. Contact Route
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact SSKM Enterprise',
    metaDescription: 'Contact SSKM for SAP consulting, enterprise integration, middleware, API management, EDI, training, web applications, or media services.',
    currentPath: '/contact',
    siteData,
    sent: false,
    error: false
  });
});

app.post('/contact', async (req, res) => {
  const { name, email, division, message } = req.body;
  try {
    await transporter.sendMail({
      from: `"SSKM Inquiry" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
      subject: `SSKM Lead: ${division} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nDivision: ${division}\n\nMessage:\n${message}`
    });
    res.render('contact', { title: 'Contact SSKM Enterprise', metaDescription: 'Contact SSKM for SAP consulting, enterprise integration, middleware, API management, EDI, training, web applications, or media services.', currentPath: '/contact', siteData, sent: true, error: false });
  } catch (err) {
    console.error(err);
    res.render('contact', { title: 'Contact SSKM Enterprise', metaDescription: 'Contact SSKM for SAP consulting, enterprise integration, middleware, API management, EDI, training, web applications, or media services.', currentPath: '/contact', siteData, sent: false, error: true });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`SSKM Web Platform running at http://localhost:${PORT}`);
});

app.get('/media', (req, res) => res.redirect('/media-services'));