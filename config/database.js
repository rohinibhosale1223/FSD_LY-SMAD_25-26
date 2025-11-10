const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const DB_PATH = path.join(__dirname, '..', 'data', 'learning_platform.db');

class Database {
    constructor() {
        this.db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('✅ Connected to SQLite database');
                this.initializeTables();
            }
        });
    }

    initializeTables() {
        // Users table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT,
                date_of_birth DATE,
                gender TEXT,
                address TEXT,
                city TEXT,
                country TEXT,
                profession TEXT,
                interests TEXT,
                bio TEXT,
                role TEXT DEFAULT 'student',
                avatar TEXT DEFAULT '/images/default-avatar.png',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
            } else {
                console.log('✅ Users table ready');
                // Add new columns if they don't exist (for existing databases)
                this.addNewUserColumns();
            }
        });

        // Courses table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                instructor TEXT NOT NULL,
                category TEXT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                rating DECIMAL(3,2) DEFAULT 0,
                students INTEGER DEFAULT 0,
                image TEXT DEFAULT '/images/default-course.jpg',
                duration TEXT,
                level TEXT DEFAULT 'Beginner',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating courses table:', err);
            } else {
                console.log('✅ Courses table ready');
                // Insert sample courses after table creation
                this.insertSampleData();
            }
        });

        // Enrollments table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                course_id INTEGER NOT NULL,
                enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                progress DECIMAL(5,2) DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (course_id) REFERENCES courses (id),
                UNIQUE(user_id, course_id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating enrollments table:', err);
            } else {
                console.log('✅ Enrollments table ready');
            }
        });

        // Cart items table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                course_id INTEGER NOT NULL,
                added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (course_id) REFERENCES courses (id),
                UNIQUE(user_id, course_id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating cart_items table:', err);
            } else {
                console.log('✅ Cart items table ready');
            }
        });
    }

    addNewUserColumns() {
        // Add new columns if they don't exist (for existing databases)
        const newColumns = [
            { name: 'phone', type: 'TEXT' },
            { name: 'date_of_birth', type: 'DATE' },
            { name: 'gender', type: 'TEXT' },
            { name: 'address', type: 'TEXT' },
            { name: 'city', type: 'TEXT' },
            { name: 'country', type: 'TEXT' },
            { name: 'profession', type: 'TEXT' },
            { name: 'interests', type: 'TEXT' },
            { name: 'bio', type: 'TEXT' }
        ];

        newColumns.forEach(column => {
            this.db.run(`ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`, (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                    console.error(`Error adding column ${column.name}:`, err);
                }
            });
        });
    }

    insertSampleData() {
        const sampleCourses = [
            {
                title: 'Full Stack Web Development',
                description: 'Master modern web development with HTML, CSS, JavaScript, Node.js, React, and MongoDB. Build complete web applications from scratch.',
                instructor: 'John Smith',
                category: 'Programming',
                price: 1099.00,
                rating: 4.8,
                students: 2150,
                image: '/images/course-1.jpg',
                duration: '40 hours',
                level: 'Intermediate'
            },
            {
                title: 'Digital Marketing Mastery',
                description: 'Learn SEO, social media marketing, email marketing, and PPC advertising to grow any business online.',
                instructor: 'Sarah Johnson',
                category: 'Marketing',
                price: 899.00,
                rating: 4.6,
                students: 1870,
                image: '/images/course-2.jpg',
                duration: '25 hours',
                level: 'Beginner'
            },
            {
                title: 'UI/UX Design Fundamentals',
                description: 'Create beautiful and user-friendly interfaces using Figma, Adobe XD, and modern design principles.',
                instructor: 'Mike Davis',
                category: 'Design',
                price: 999.00,
                rating: 4.9,
                students: 1340,
                image: '/images/course-3.jpg',
                duration: '30 hours',
                level: 'Beginner'
            },
            {
                title: 'Python for Data Science',
                description: 'Learn Python programming, pandas, NumPy, matplotlib, and machine learning fundamentals.',
                instructor: 'Dr. Emily Chen',
                category: 'Data Science',
                price: 1299.00,
                rating: 4.7,
                students: 890,
                image: '/images/course-4.jpg',
                duration: '45 hours',
                level: 'Intermediate'
            },
            {
                title: 'Mobile App Development with React Native',
                description: 'Build cross-platform mobile apps for iOS and Android using React Native and Expo.',
                instructor: 'Alex Rodriguez',
                category: 'Mobile Development',
                price: 1199.00,
                rating: 4.5,
                students: 765,
                image: '/images/course-5.jpg',
                duration: '35 hours',
                level: 'Advanced'
            },
            {
                title: 'Cybersecurity Essentials',
                description: 'Learn network security, ethical hacking, and how to protect systems from cyber threats.',
                instructor: 'David Wilson',
                category: 'Security',
                price: 1399.00,
                rating: 4.8,
                students: 456,
                image: '/images/course-6.jpg',
                duration: '50 hours',
                level: 'Intermediate'
            }
        ];

        // Check if courses already exist
        this.db.get("SELECT COUNT(*) as count FROM courses", (err, row) => {
            if (err) {
                console.error('Error checking courses:', err);
                return;
            }

            if (row.count === 0) {
                const stmt = this.db.prepare(`
                    INSERT INTO courses (title, description, instructor, category, price, rating, students, image, duration, level)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                sampleCourses.forEach(course => {
                    stmt.run([
                        course.title,
                        course.description,
                        course.instructor,
                        course.category,
                        course.price,
                        course.rating,
                        course.students,
                        course.image,
                        course.duration,
                        course.level
                    ]);
                });

                stmt.finalize();
                console.log('✅ Sample courses inserted successfully');
            }
        });
    }

    getDb() {
        return this.db;
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}

module.exports = new Database();