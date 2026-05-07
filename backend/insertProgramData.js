const mysql = require('mysql2/promise');
require('dotenv').config();

const insertHackathonData = async () => {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'stackenzo_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('📦 Connected to database...');

    // Sample hackathon data
    const hackathonData = {
      title: "Stackenzo Innovation Hackathon 2024",
      type: "hackathon",
      date: "2024-03-15",
      location: "Nellore, Andhra Pradesh",
      description: "Join us for an exciting 48-hour hackathon where students and professionals collaborate to build innovative solutions using cutting-edge technologies. Compete for prizes worth ₹1,00,000 and get mentorship from industry experts.",
      duration: "48 hours",
      status: "registration-open",
      registration_link: "https://stackenzo.com/hackathon-2024",
      tags: JSON.stringify(["AI/ML", "Web Development", "Mobile Apps", "IoT", "Blockchain", "Innovation"])
    };

    // Insert hackathon data
    const [result] = await connection.query(`
      INSERT INTO programs (title, type, date, location, description, duration, status, registration_link, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      hackathonData.title,
      hackathonData.type,
      hackathonData.date,
      hackathonData.location,
      hackathonData.description,
      hackathonData.duration,
      hackathonData.status,
      hackathonData.registration_link,
      hackathonData.tags
    ]);

    console.log('✅ Hackathon data inserted successfully!');
    console.log(`📊 Program ID: ${result.insertId}`);
    console.log(`📝 Title: ${hackathonData.title}`);
    console.log(`📅 Date: ${hackathonData.date}`);
    console.log(`📍 Location: ${hackathonData.location}`);

    // Insert more sample programs
    const samplePrograms = [
      {
        title: "Web Development Workshop",
        type: "workshop",
        date: "2024-02-20",
        location: "Online",
        description: "Learn modern web development with React, Node.js, and MongoDB. Build a complete full-stack application from scratch.",
        duration: "3 days",
        status: "upcoming",
        registration_link: "https://stackenzo.com/web-workshop",
        tags: JSON.stringify(["React", "Node.js", "MongoDB", "Full-Stack"])
      },
      {
        title: "AI/ML Challenge 2024",
        type: "challenge",
        date: "2024-04-10",
        location: "Hybrid",
        description: "Solve real-world problems using artificial intelligence and machine learning. Work with datasets and build predictive models.",
        duration: "1 week",
        status: "upcoming",
        registration_link: "https://stackenzo.com/ai-challenge",
        tags: JSON.stringify(["Python", "TensorFlow", "Data Science", "Machine Learning"])
      },
      {
        title: "Robotics for Schools Program",
        type: "school-program",
        date: "2024-03-01",
        location: "Nellore Schools",
        description: "Interactive robotics program for school students (Classes 6-9). Learn programming, electronics, and build your own robots.",
        duration: "6 months",
        status: "ongoing",
        registration_link: "https://stackenzo.com/school-robotics",
        tags: JSON.stringify(["Robotics", "Arduino", "Programming", "STEM"])
      },
      {
        title: "Tech Expo 2024",
        type: "expo",
        date: "2024-05-15",
        location: "Nellore Convention Center",
        description: "Showcase your innovative projects and connect with industry leaders. Exhibition of latest technologies and startup pitches.",
        duration: "2 days",
        status: "upcoming",
        registration_link: "https://stackenzo.com/tech-expo",
        tags: JSON.stringify(["Innovation", "Startups", "Technology", "Networking"])
      }
    ];

    // Insert sample programs
    for (const program of samplePrograms) {
      await connection.query(`
        INSERT INTO programs (title, type, date, location, description, duration, status, registration_link, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        program.title,
        program.type,
        program.date,
        program.location,
        program.description,
        program.duration,
        program.status,
        program.registration_link,
        program.tags
      ]);
      console.log(`✅ Added: ${program.title}`);
    }

    console.log('\n🎉 All sample programs inserted successfully!');
    console.log('🔗 You can now view them at: https://stackenzo-backend.onrender.com/Programs');

  } catch (error) {
    console.error('❌ Error inserting data:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Run the script
insertHackathonData()
  .then(() => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });