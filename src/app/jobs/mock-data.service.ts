import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Job, JobsResponse } from './models';
import { JobApplication, ApplicationStatus, ApplicationResponse, CreateApplicationDto } from './models/application.models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockJobs: Job[] = [
    {
      id: '1',
      title: 'Full Stack Web Developer for E-commerce Platform',
      description: 'We are looking for an experienced full-stack developer to build a modern e-commerce platform. The project involves creating a responsive frontend using Angular and a robust backend with Node.js and PostgreSQL. You will be responsible for implementing payment integration, user authentication, product catalog management, and order processing systems.',
      category: 'web-development',
      budget: 5000,
      budgetType: 'FIXED',
      deadline: '2025-12-31',
      location: 'Remote',
      locationType: 'REMOTE',
      skills: ['Angular', 'Node.js', 'PostgreSQL', 'TypeScript', 'REST API', 'Payment Integration'],
      status: 'COMPLETED', // Changed to COMPLETED
      customerId: 'customer1',
      customerName: 'Tech Startup Inc.',
      customerAvatar: 'https://i.pravatar.cc/150?img=1',
      applicationsCount: 12,
      createdAt: '2025-09-01T10:00:00Z',
      updatedAt: '2025-10-15T14:30:00Z'
    },
    {
      id: '2',
      title: 'Mobile App Developer - iOS & Android',
      description: 'Seeking a skilled mobile developer to create a fitness tracking application for both iOS and Android platforms. The app should include features like workout tracking, nutrition logging, progress charts, social sharing, and integration with wearable devices. Experience with React Native or Flutter is required.',
      category: 'mobile-development',
      budget: 75,
      budgetType: 'HOURLY',
      deadline: '2025-11-15',
      location: 'New York, USA',
      locationType: 'HYBRID',
      skills: ['React Native', 'iOS', 'Android', 'Firebase', 'API Integration', 'UI/UX'],
      status: 'COMPLETED', // Changed to COMPLETED
      customerId: 'customer2',
      customerName: 'FitLife Solutions',
      customerAvatar: 'https://i.pravatar.cc/150?img=2',
      applicationsCount: 8,
      createdAt: '2025-08-28T09:15:00Z',
      updatedAt: '2025-10-14T16:45:00Z'
    },
    {
      id: '9',
      title: 'React E-Learning Platform Development',
      description: 'We need an experienced React developer to build an interactive e-learning platform with video streaming, quiz functionality, progress tracking, and student-teacher interaction features. The platform should support multiple courses, user authentication, and payment integration for course purchases.',
      category: 'web-development',
      budget: 6500,
      budgetType: 'FIXED',
      deadline: '2025-12-20',
      location: 'Remote',
      locationType: 'REMOTE',
      skills: ['React', 'Node.js', 'MongoDB', 'Video Streaming', 'WebRTC', 'Stripe API'],
      status: 'IN_PROGRESS',
      customerId: 'emily-chen',
      customerName: 'Emily Chen',
      customerAvatar: 'https://i.pravatar.cc/150?img=20',
      applicationsCount: 10,
      createdAt: '2025-09-15T08:30:00Z',
      updatedAt: '2025-10-16T11:15:00Z'
    },
    {
      id: '10',
      title: 'Vue.js Dashboard for Analytics Platform',
      description: 'Looking for a Vue.js expert to develop a comprehensive analytics dashboard with real-time data visualization, custom reporting features, and interactive charts. The dashboard should integrate with our existing REST API and provide intuitive data filtering and export capabilities.',
      category: 'web-development',
      budget: 4200,
      budgetType: 'FIXED',
      deadline: '2025-09-30',
      location: 'Remote',
      locationType: 'REMOTE',
      skills: ['Vue.js', 'Chart.js', 'REST API', 'JavaScript', 'Vuex', 'CSS3'],
      status: 'COMPLETED',
      customerId: 'emily-chen',
      customerName: 'Emily Chen',
      customerAvatar: 'https://i.pravatar.cc/150?img=20',
      applicationsCount: 14,
      createdAt: '2025-07-20T10:00:00Z',
      updatedAt: '2025-10-01T16:30:00Z'
    },
    {
      id: '3',
      title: 'UI/UX Designer for SaaS Dashboard',
      description: 'We need a talented UI/UX designer to redesign our SaaS analytics dashboard. The project includes creating wireframes, high-fidelity mockups, interactive prototypes, and a comprehensive design system. The designer should have experience with data visualization and creating intuitive user interfaces for complex applications.',
      category: 'design',
      budget: 3500,
      budgetType: 'FIXED',
      deadline: '2025-10-30',
      location: 'San Francisco, USA',
      locationType: 'REMOTE',
      skills: ['Figma', 'UI/UX Design', 'Prototyping', 'Design Systems', 'Data Visualization', 'Wireframing'],
      status: 'OPEN',
      customerId: 'customer3',
      customerName: 'DataViz Corp',
      customerAvatar: 'https://i.pravatar.cc/150?img=3',
      applicationsCount: 15,
      createdAt: '2025-09-25T11:30:00Z',
      updatedAt: '2025-10-16T10:20:00Z'
    },
    {
      id: '4',
      title: 'DevOps Engineer - AWS Infrastructure',
      description: 'Looking for an experienced DevOps engineer to set up and manage our AWS infrastructure. Responsibilities include configuring CI/CD pipelines, implementing containerization with Docker and Kubernetes, setting up monitoring and logging systems, and ensuring high availability and security of our cloud infrastructure.',
      category: 'devops',
      budget: 95,
      budgetType: 'HOURLY',
      deadline: '2025-11-30',
      location: 'Remote',
      locationType: 'REMOTE',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Linux'],
      status: 'OPEN',
      customerId: 'customer4',
      customerName: 'CloudTech Systems',
      customerAvatar: 'https://i.pravatar.cc/150?img=4',
      applicationsCount: 6,
      createdAt: '2025-10-05T08:00:00Z',
      updatedAt: '2025-10-15T09:10:00Z'
    },
    {
      id: '5',
      title: 'Content Writer - Technical Blog Posts',
      description: 'We are seeking an experienced technical content writer to create engaging blog posts about web development, cloud computing, and DevOps topics. The writer should be able to explain complex technical concepts in an accessible way and have SEO knowledge. 10-15 articles per month, 1500-2000 words each.',
      category: 'writing',
      budget: 50,
      budgetType: 'HOURLY',
      deadline: '2025-12-15',
      location: 'Remote',
      locationType: 'REMOTE',
      skills: ['Content Writing', 'Technical Writing', 'SEO', 'Blog Writing', 'Research', 'Copywriting'],
      status: 'OPEN',
      customerId: 'customer5',
      customerName: 'Tech Media Group',
      customerAvatar: 'https://i.pravatar.cc/150?img=5',
      applicationsCount: 20,
      createdAt: '2025-09-20T13:45:00Z',
      updatedAt: '2025-10-12T15:30:00Z'
    },
    {
      id: '6',
      title: 'Python Data Scientist - Machine Learning',
      description: 'Seeking a data scientist to develop machine learning models for customer behavior prediction. The project involves data cleaning, feature engineering, model training and evaluation, and deployment. Experience with Python, scikit-learn, TensorFlow, and data visualization tools is essential.',
      category: 'data-science',
      budget: 8000,
      budgetType: 'FIXED',
      deadline: '2026-01-15',
      location: 'Boston, USA',
      locationType: 'ONSITE',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'scikit-learn', 'Data Analysis', 'Pandas', 'NumPy'],
      status: 'OPEN',
      customerId: 'customer6',
      customerName: 'AI Research Lab',
      customerAvatar: 'https://i.pravatar.cc/150?img=6',
      applicationsCount: 9,
      createdAt: '2025-10-08T10:30:00Z',
      updatedAt: '2025-10-16T11:00:00Z'
    },
    {
      id: '7',
      title: 'WordPress Developer for Blog Customization',
      description: 'Need a WordPress developer to customize a blog theme, add custom plugins, optimize performance, and implement SEO best practices. The project also includes migrating content from an old site and setting up email marketing integration.',
      category: 'web-development',
      budget: 2500,
      budgetType: 'FIXED',
      deadline: '2025-11-10',
      location: 'Remote',
      locationType: 'REMOTE',
      skills: ['WordPress', 'PHP', 'CSS', 'JavaScript', 'SEO', 'Plugin Development'],
      status: 'OPEN',
      customerId: 'customer7',
      customerName: 'Digital Marketing Agency',
      customerAvatar: 'https://i.pravatar.cc/150?img=7',
      applicationsCount: 18,
      createdAt: '2025-09-30T14:00:00Z',
      updatedAt: '2025-10-14T17:20:00Z'
    },
    {
      id: '8',
      title: 'Social Media Marketing Specialist',
      description: 'Looking for a social media marketing expert to manage our brand presence across Instagram, Twitter, LinkedIn, and Facebook. Responsibilities include content creation, community management, analytics reporting, and running paid advertising campaigns.',
      category: 'marketing',
      budget: 45,
      budgetType: 'HOURLY',
      deadline: '2025-12-31',
      location: 'Remote',
      locationType: 'REMOTE',
      skills: ['Social Media Marketing', 'Content Creation', 'Facebook Ads', 'Instagram Marketing', 'Analytics', 'Copywriting'],
      status: 'OPEN',
      customerId: 'customer8',
      customerName: 'Fashion Brand Co.',
      customerAvatar: 'https://i.pravatar.cc/150?img=8',
      applicationsCount: 25,
      createdAt: '2025-09-22T09:00:00Z',
      updatedAt: '2025-10-15T12:45:00Z'
    }
  ];

  private mockApplications: JobApplication[] = [
    {
      id: 'app1',
      jobId: '1',
      freelancerId: 'freelancer1',
      message: 'I am very interested in this project and believe my 5 years of experience in full-stack development makes me an ideal candidate. I have successfully delivered similar e-commerce platforms in the past.',
      portfolioLink: 'https://github.com/johndoe',
      coverLetter: 'Dear Hiring Manager,\n\nI am writing to express my strong interest in the Full Stack Web Developer position for your e-commerce platform. With over 5 years of hands-on experience in building scalable web applications using Angular, Node.js, and PostgreSQL, I am confident in my ability to deliver a high-quality solution that meets your requirements.\n\nIn my previous role at TechCorp, I led the development of a similar e-commerce platform that processed over $2M in transactions annually. I implemented secure payment integration using Stripe, built a comprehensive admin dashboard, and optimized database queries to handle 10,000+ daily users.\n\nI am particularly excited about this opportunity because it aligns perfectly with my technical expertise and passion for creating seamless user experiences. I am committed to writing clean, maintainable code and following best practices in software development.\n\nThank you for considering my application. I look forward to discussing how I can contribute to your project.\n\nBest regards,\nJohn Doe',
      proposedRate: 4800,
      estimatedDuration: '3 months',
      status: ApplicationStatus.PENDING,
      appliedAt: new Date('2025-10-12T10:30:00Z'),
      updatedAt: new Date('2025-10-12T10:30:00Z'),
      freelancerName: 'John Doe',
      jobTitle: 'Full Stack Web Developer for E-commerce Platform'
    },
    {
      id: 'app2',
      jobId: '2',
      freelancerId: 'freelancer1',
      message: 'I have extensive experience with React Native and have published 8 apps on both iOS and Android stores. I would love to work on your fitness tracking application.',
      portfolioLink: 'https://portfolio.johndoe.com',
      coverLetter: 'Hello FitLife Solutions Team,\n\nI am thrilled about the opportunity to develop your fitness tracking application. As a mobile developer with 4 years of experience specializing in React Native, I have successfully launched 8 applications that collectively have over 100,000 downloads.\n\nMy recent project was a nutrition tracking app that integrated with Fitbit and Apple Health, which seems directly relevant to your requirements. I implemented features like real-time data synchronization, offline mode, push notifications, and beautiful data visualizations using Chart.js.\n\nI am proficient in both iOS and Android development, understand platform-specific design guidelines, and always ensure smooth performance across devices. My apps consistently receive 4.5+ star ratings due to their intuitive interfaces and reliability.\n\nI am excited to bring my expertise to your project and create an app that will help users achieve their fitness goals.\n\nLooking forward to collaborating with you!\n\nBest,\nJohn Doe',
      proposedRate: 70,
      estimatedDuration: '2.5 months',
      status: ApplicationStatus.ACCEPTED,
      appliedAt: new Date('2025-10-08T14:15:00Z'),
      updatedAt: new Date('2025-10-14T09:20:00Z'),
      freelancerName: 'John Doe',
      jobTitle: 'Mobile App Developer - iOS & Android'
    },
    {
      id: 'app3',
      jobId: '5',
      freelancerId: 'freelancer1',
      message: 'As a technical writer with a computer science background, I can create engaging content that explains complex topics in simple terms. I have written over 200 technical articles.',
      coverLetter: 'Dear Tech Media Group,\n\nI am writing to apply for the Technical Content Writer position. With a Bachelor\'s degree in Computer Science and 3 years of professional technical writing experience, I bring both technical expertise and strong writing skills to your team.\n\nI have written over 200 technical articles covering topics like web development, cloud computing, microservices, and DevOps for publications including Dev.to, Medium, and various tech blogs. My articles consistently rank in the top search results due to my SEO optimization strategies.\n\nI understand how to break down complex technical concepts into digestible content for different audiences - from beginners to advanced developers. I always conduct thorough research, include practical examples, and ensure accuracy in all my work.\n\nMy typical workflow includes keyword research, outline creation, writing, editing, and optimization for search engines. I am comfortable with 10-15 articles per month and can maintain consistent quality across all deliverables.\n\nI would love to contribute to your content strategy and help establish your brand as a thought leader in the tech space.\n\nThank you for your consideration!\n\nBest regards,\nJohn Doe',
      proposedRate: 48,
      estimatedDuration: 'Ongoing',
      status: ApplicationStatus.REJECTED,
      appliedAt: new Date('2025-09-28T11:00:00Z'),
      updatedAt: new Date('2025-10-05T16:30:00Z'),
      freelancerName: 'John Doe',
      jobTitle: 'Content Writer - Technical Blog Posts'
    },
    {
      id: 'app4',
      jobId: '3',
      freelancerId: 'freelancer1',
      message: 'I specialize in designing SaaS dashboards and have worked on multiple data-heavy applications. My designs focus on usability and data clarity.',
      portfolioLink: 'https://dribbble.com/johndoe',
      coverLetter: 'Hello DataViz Corp Team,\n\nI am excited to apply for the UI/UX Designer position for your SaaS analytics dashboard. With 4 years of experience designing enterprise-level dashboards and a deep understanding of data visualization principles, I am confident I can elevate your product\'s user experience.\n\nMy approach to dashboard design focuses on three key principles: clarity, efficiency, and delight. I have designed dashboards for clients in fintech, healthcare, and e-commerce industries, all requiring complex data presentation in intuitive interfaces.\n\nIn my recent project for a financial analytics platform, I redesigned their dashboard which resulted in a 40% reduction in user task completion time and a 30% increase in user satisfaction scores. I achieved this through user research, iterative prototyping, and close collaboration with the development team.\n\nI am proficient in Figma, have extensive experience creating design systems, and understand how to balance aesthetic appeal with functional requirements. I always ensure my designs are accessible and work seamlessly across different screen sizes.\n\nI would love to show you my portfolio and discuss how I can help transform your analytics dashboard into a best-in-class product.\n\nLooking forward to hearing from you!\n\nWarm regards,\nJohn Doe',
      proposedRate: 3200,
      estimatedDuration: '6 weeks',
      status: ApplicationStatus.PENDING,
      appliedAt: new Date('2025-10-10T16:45:00Z'),
      updatedAt: new Date('2025-10-10T16:45:00Z'),
      freelancerName: 'John Doe',
      jobTitle: 'UI/UX Designer for SaaS Dashboard'
    },
    {
      id: 'app5',
      jobId: '7',
      freelancerId: 'freelancer1',
      message: 'I have been working with WordPress for 6 years and have customized over 50 websites. I can handle all aspects of your project including theme customization, plugin development, and performance optimization.',
      portfolioLink: 'https://johndoe-portfolio.com',
      coverLetter: 'Dear Digital Marketing Agency,\n\nI am writing to express my interest in the WordPress Developer position for your blog customization project. With 6 years of specialized experience in WordPress development, I have the skills and expertise to deliver exactly what you need.\n\nI have successfully completed over 50 WordPress projects, ranging from simple blog setups to complex e-commerce websites. My expertise includes custom theme development, plugin creation, performance optimization, and SEO implementation.\n\nFor a recent client, I reduced their website load time from 8 seconds to 2 seconds through image optimization, caching implementation, and code minification. I also migrated their site from an old platform with zero downtime and maintained all SEO rankings.\n\nI am very familiar with email marketing integrations (Mailchimp, ConvertKit, ActiveCampaign) and can seamlessly implement these into your WordPress setup. I always follow WordPress coding standards and ensure all customizations are update-safe.\n\nI am confident I can deliver a high-quality, fast, and SEO-optimized WordPress blog that meets all your requirements.\n\nThank you for considering my application. I look forward to working with you!\n\nBest regards,\nJohn Doe',
      proposedRate: 2400,
      estimatedDuration: '4 weeks',
      status: ApplicationStatus.PENDING,
      appliedAt: new Date('2025-10-14T13:20:00Z'),
      updatedAt: new Date('2025-10-14T13:20:00Z'),
      freelancerName: 'John Doe',
      jobTitle: 'WordPress Developer for Blog Customization'
    },
    {
      id: 'app6',
      jobId: '9',
      freelancerId: 'freelancer1',
      message: 'I am excited about building your e-learning platform! I have 5 years of experience with React and have built similar platforms with video streaming capabilities.',
      portfolioLink: 'https://github.com/johndoe',
      coverLetter: 'Dear Emily Chen,\n\nI am thrilled to apply for the React E-Learning Platform Development project. With 5 years of specialized experience in React development and a proven track record of building educational technology platforms, I am confident I can deliver an exceptional solution.\n\nI recently completed a similar project for an online training company where I implemented video streaming using AWS CloudFront, built interactive quiz modules with real-time feedback, and created a comprehensive progress tracking system. The platform now serves over 5,000 active students with 99.9% uptime.\n\nMy technical expertise includes React hooks, Redux for state management, Node.js for backend APIs, MongoDB for data storage, and integration with payment gateways like Stripe. I am also experienced with WebRTC for real-time video communication and have implemented live class features in previous projects.\n\nI understand the importance of creating an intuitive user experience for both students and teachers, and I always prioritize performance optimization to ensure smooth video playback even on slower connections.\n\nI would love to discuss your specific requirements and show you examples of my previous e-learning projects.\n\nLooking forward to working with you!\n\nBest regards,\nJohn Doe',
      proposedRate: 6200,
      estimatedDuration: '3 months',
      status: ApplicationStatus.ACCEPTED,
      appliedAt: new Date('2025-09-18T10:30:00Z'),
      updatedAt: new Date('2025-09-22T14:15:00Z'),
      freelancerName: 'John Doe',
      jobTitle: 'React E-Learning Platform Development'
    },
    {
      id: 'app7',
      jobId: '10',
      freelancerId: 'freelancer1',
      message: 'I am a Vue.js expert with extensive experience building analytics dashboards. I have worked on several data visualization projects and can create beautiful, interactive charts.',
      portfolioLink: 'https://portfolio.johndoe.com/vue-projects',
      coverLetter: 'Dear Emily Chen,\n\nI am writing to express my strong interest in the Vue.js Dashboard for Analytics Platform project. As a Vue.js specialist with 4 years of experience building data-intensive dashboards, I have the perfect skill set for this project.\n\nIn my recent role at DataTech Solutions, I developed a comprehensive analytics dashboard that processed and visualized data from multiple sources. I implemented real-time updates using WebSockets, created custom chart components with Chart.js and D3.js, and built an advanced filtering system that allowed users to slice and dice data in multiple ways.\n\nI am highly proficient in Vue.js 3, Vuex for state management, Vue Router, and modern JavaScript/TypeScript. I also have strong experience with data visualization libraries and creating responsive, accessible interfaces that work seamlessly across all devices.\n\nMy approach emphasizes performance optimization - I use virtual scrolling for large datasets, implement efficient caching strategies, and ensure smooth interactions even when handling thousands of data points.\n\nI completed this project on time and the dashboard now serves as the primary analytics tool for the entire organization.\n\nI would be honored to bring my expertise to your project!\n\nBest regards,\nJohn Doe',
      proposedRate: 4000,
      estimatedDuration: '6 weeks',
      status: ApplicationStatus.ACCEPTED,
      appliedAt: new Date('2025-07-25T09:00:00Z'),
      updatedAt: new Date('2025-07-28T11:30:00Z'),
      freelancerName: 'John Doe',
      jobTitle: 'Vue.js Dashboard for Analytics Platform'
    }
  ];

  constructor() {}

  // Mock Jobs Service Methods
  getJobs(page: number = 0, size: number = 10): Observable<JobsResponse> {
    const start = page * size;
    const end = start + size;
    const paginatedJobs = this.mockJobs.slice(start, end);

    return of({
      content: paginatedJobs,
      totalElements: this.mockJobs.length,
      totalPages: Math.ceil(this.mockJobs.length / size),
      size: size,
      number: page
    }).pipe(delay(500)); // Simulate network delay
  }

  getMyJobs(customerId: string, page: number = 0, size: number = 10): Observable<JobsResponse> {
    // Filter jobs by customer ID
    const customerJobs = this.mockJobs.filter(j => j.customerId === customerId);

    const start = page * size;
    const end = start + size;
    const paginatedJobs = customerJobs.slice(start, end);

    return of({
      content: paginatedJobs,
      totalElements: customerJobs.length,
      totalPages: Math.ceil(customerJobs.length / size),
      size: size,
      number: page
    }).pipe(delay(500));
  }

  getJobById(id: string): Observable<Job> {
    const job = this.mockJobs.find(j => j.id === id);
    if (!job) {
      throw new Error('Job not found');
    }
    return of(job).pipe(delay(300));
  }

  searchJobs(filters: any, page: number = 0, size: number = 10): Observable<JobsResponse> {
    console.log('🔍 searchJobs called with filters:', JSON.stringify(filters, null, 2));

    let filteredJobs = [...this.mockJobs];
    console.log(`📊 Starting with ${filteredJobs.length} total jobs`);

    // Apply search filter - search in title, description, and skills
    if (filters.search) {
      const search = filters.search.toLowerCase();
      console.log(`🔎 Applying search filter: "${search}"`);
      filteredJobs = filteredJobs.filter(j =>
        j.title.toLowerCase().includes(search) ||
        j.description.toLowerCase().includes(search) ||
        (j.skills && j.skills.some(skill => skill.toLowerCase().includes(search))) ||
        (j.location && j.location.toLowerCase().includes(search))
      );
      console.log(`   ✓ After search filter: ${filteredJobs.length} jobs`);
    }

    // Apply category filter
    if (filters.category) {
      console.log(`📁 Applying category filter: "${filters.category}"`);
      console.log(`   Jobs before filter:`, filteredJobs.map(j => ({ title: j.title, category: j.category })));
      filteredJobs = filteredJobs.filter(j => j.category === filters.category);
      console.log(`   ✓ After category filter: ${filteredJobs.length} jobs`);
      console.log(`   Jobs after filter:`, filteredJobs.map(j => ({ title: j.title, category: j.category })));
    }

    // Apply location type filter
    if (filters.locationType) {
      console.log(`📍 Applying location type filter: "${filters.locationType}"`);
      console.log(`   Jobs before filter:`, filteredJobs.map(j => ({ title: j.title, locationType: j.locationType })));
      filteredJobs = filteredJobs.filter(j => j.locationType === filters.locationType);
      console.log(`   ✓ After location type filter: ${filteredJobs.length} jobs`);
    }

    // Apply budget type filter
    if (filters.budgetType) {
      console.log(`💰 Applying budget type filter: "${filters.budgetType}"`);
      console.log(`   Jobs before filter:`, filteredJobs.map(j => ({ title: j.title, budgetType: j.budgetType })));
      filteredJobs = filteredJobs.filter(j => j.budgetType === filters.budgetType);
      console.log(`   ✓ After budget type filter: ${filteredJobs.length} jobs`);
    }

    // Apply budget range filters
    if (filters.minBudget !== undefined && filters.minBudget !== null && filters.minBudget !== '') {
      const minBudget = Number(filters.minBudget);
      console.log(`💵 Applying min budget filter: ${minBudget}`);
      filteredJobs = filteredJobs.filter(j => j.budget >= minBudget);
      console.log(`   ✓ After min budget filter: ${filteredJobs.length} jobs`);
    }

    if (filters.maxBudget !== undefined && filters.maxBudget !== null && filters.maxBudget !== '') {
      const maxBudget = Number(filters.maxBudget);
      console.log(`💵 Applying max budget filter: ${maxBudget}`);
      filteredJobs = filteredJobs.filter(j => j.budget <= maxBudget);
      console.log(`   ✓ After max budget filter: ${filteredJobs.length} jobs`);
    }

    // Apply customer ID filter (for customers viewing their own jobs)
    if (filters.customerId) {
      console.log(`👤 Applying customer ID filter: "${filters.customerId}"`);
      filteredJobs = filteredJobs.filter(j => j.customerId === filters.customerId);
      console.log(`   ✓ After customer ID filter: ${filteredJobs.length} jobs`);
    }

    // Apply status filter if provided
    if (filters.status) {
      console.log(`📌 Applying status filter: "${filters.status}"`);
      filteredJobs = filteredJobs.filter(j => j.status === filters.status);
      console.log(`   ✓ After status filter: ${filteredJobs.length} jobs`);
    }

    // Apply skills filter if provided
    if (filters.skills && filters.skills.length > 0) {
      console.log(`🎯 Applying skills filter:`, filters.skills);
      filteredJobs = filteredJobs.filter(j =>
        j.skills && filters.skills!.some((skill: string) =>
          j.skills!.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
      console.log(`   ✓ After skills filter: ${filteredJobs.length} jobs`);
    }

    console.log(`✅ Final result: ${filteredJobs.length} jobs match all filters`);

    // Pagination
    const start = page * size;
    const end = start + size;
    const paginatedJobs = filteredJobs.slice(start, end);

    return of({
      content: paginatedJobs,
      totalElements: filteredJobs.length,
      totalPages: Math.ceil(filteredJobs.length / size),
      size: size,
      number: page
    }).pipe(delay(500));
  }

  // Mock Applications Service Methods
  getMyApplications(status?: ApplicationStatus): Observable<JobApplication[]> {
    let applications = [...this.mockApplications];

    if (status) {
      applications = applications.filter(app => app.status === status);
    }

    return of(applications).pipe(delay(500));
  }

  hasApplied(jobId: string): Observable<boolean> {
    const hasApplied = this.mockApplications.some(app => app.jobId === jobId);
    return of(hasApplied).pipe(delay(200));
  }

  submitApplication(application: CreateApplicationDto): Observable<ApplicationResponse> {
    const newApplication: JobApplication = {
      id: `app${this.mockApplications.length + 1}`,
      jobId: application.jobId,
      freelancerId: 'freelancer1',
      message: application.message,
      portfolioLink: application.portfolioLink,
      coverLetter: application.coverLetter,
      proposedRate: application.proposedRate,
      estimatedDuration: application.estimatedDuration,
      status: ApplicationStatus.PENDING,
      appliedAt: new Date(),
      updatedAt: new Date(),
      freelancerName: 'John Doe',
      jobTitle: this.mockJobs.find(j => j.id === application.jobId)?.title || 'Job'
    };

    this.mockApplications.push(newApplication);

    return of({
      success: true,
      message: 'Application submitted successfully',
      application: newApplication
    }).pipe(delay(800));
  }

  withdrawApplication(id: string): Observable<ApplicationResponse> {
    const application = this.mockApplications.find(app => app.id === id);
    if (application) {
      application.status = ApplicationStatus.WITHDRAWN;
      application.updatedAt = new Date();
    }

    return of({
      success: true,
      message: 'Application withdrawn successfully'
    }).pipe(delay(500));
  }

  getApplicationById(id: string): Observable<JobApplication> {
    const application = this.mockApplications.find(app => app.id === id);
    if (!application) {
      throw new Error('Application not found');
    }
    return of(application).pipe(delay(300));
  }

  getJobApplications(jobId: string): Observable<JobApplication[]> {
    const applications = this.mockApplications.filter(app => app.jobId === jobId);
    return of(applications).pipe(delay(500));
  }

  updateApplicationStatus(id: string, status: ApplicationStatus): Observable<ApplicationResponse> {
    const application = this.mockApplications.find(app => app.id === id);
    if (application) {
      application.status = status;
      application.updatedAt = new Date();
    }

    return of({
      success: true,
      message: `Application status updated to ${status}`
    }).pipe(delay(500));
  }
}
