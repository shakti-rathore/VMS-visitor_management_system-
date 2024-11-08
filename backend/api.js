import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db.js';
import Visitor from './visitor.js';
import User from './user.js'; // Adjust the path if necessary
import path from 'path'; // Use import for path
import { fileURLToPath } from 'url'; // Import fileURLToPath from 'url'
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import bcrypt from 'bcryptjs'; // New import

const __filename = fileURLToPath(import.meta.url); // Get the current filename
const __dirname = path.dirname(__filename); // Get the current directory name

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to the database
connectDB();

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend'))); // Adjust the path accordingly

// Routes
app.get('/', (req, res) => {
    res.send('Visitor Management System API');
});

// Register a visitor
app.post('/api/visitorss', async (req, res) => {
    try {
        const { name, contact, visitDate, reason, hostId } = req.body; // Get the hostId from the form or session

        // Fetch the employee's (host's) username using the hostId
        const host = await User.findById(hostId);
        if (!host) {
            return res.status(404).json({ message: 'Host not found' }); // Error if the employee (host) is not found
        }

        // Create a new visitor entry with the employee's (host's) username
        const newVisitor = new Visitor({
            name,
            contact,
            visitDate,
            reason,
            hostId,
            hostName: host.username // Assign the correct employee's (host's) username here
        });
        console.log(newVisitor);
        await newVisitor.save(); // Save the visitor to the database
        res.status(201).json(newVisitor);
    } catch (error) {
        console.error('Error saving visitor:', error); // Log errors for debugging
        res.status(500).json({ message: 'Server error', error });
    }
});


// Register User
app.post('/api/register', async (req, res) => {
    const { username, password, role, email, emailPassword } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user without hashing the password
        const newUser = new User({
            username,
            password,  
            role,
            email,
            emailPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


// Login Route
 app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username and password
        const user = await User.findOne({ username, password }); // password should ideally be hashed, as discussed

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token based on user role
        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        
        // Send response including user role to determine the interface
        res.status(200).json({ message: 'Login successful', token, userId: user._id, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid Token');
        }
        req.user = decoded; // Attach the decoded user information to the request
        next(); // Proceed to the next middleware or route handler
    });
};

// Get visitors - protected route
app.get('/api/visitors', verifyToken, async (req, res) => {
    const { afterId } = req.query;

    let query = {};
    if (afterId) {
        query._id = { $gt: afterId };
    }

    try {
        const visitors = await Visitor.find(query).sort({ _id: 1 }).limit(50);
        res.json(visitors);
    } catch (error) {
        console.error('Error fetching visitors:', error);
        res.status(500).send('Server error');
    }
});

// Get visitors by host - protected route
app.get('/api/visitors/host/:hostId', verifyToken, async (req, res) => {
    try {
        const hostId = req.params.hostId;
        const visits = await Visitor.find({ hostId });
        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Check-in a visitor - protected route
app.patch('/api/visitors/:id/checkin', verifyToken, async (req, res) => {
    try {
        // Find the visitor by ID and mark as checked in
        const visitor = await Visitor.findById(req.params.id).populate('hostId');
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }

        // Update visitor status
        visitor.status = 'checked-in';
        visitor.checkInTime = new Date();
        await visitor.save();

        // Fetch the receptionist's email from the logged-in user (use localStorage or session management for this)
        const receptionistId = req.body.receptionistId; // Assuming you pass receptionistId from the frontend
        const receptionist = await User.findById(receptionistId);
        console.log(receptionist, "Receptionist details");

        if (!receptionist || !receptionist.email || !receptionist.emailPassword) {
            return res.status(400).json({ message: 'Receptionist email or password not available' });
        }

        // Prepare the email for the host
        const host = visitor.hostId;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: receptionist.email, // Receptionist's email
                pass: receptionist.emailPassword // Receptionist's Gmail App Password
            }
        });

        const mailOptions = {
            from: receptionist.email, // Receptionist's email
            to: host.email, // Host's email
            subject: 'Visitor Check-In Notification',
            text: `Dear ${host.username}, your visitor ${visitor.name} has checked in at ${visitor.checkInTime}.`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email', error });
            }
            console.log('Email sent:', info.response);
            // Send response after successful email
            return res.json({ message: 'Visitor checked in successfully and email sent to host', visitor });
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
});

// Check-out a visitor - protected route
app.patch('/api/visitors/:id/checkout', verifyToken, async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id);
        visitor.status = 'checked-out';
        visitor.checkOutTime = new Date();
        await visitor.save();
        res.json(visitor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.patch('/api/users/:userId/updateEmail', verifyToken, async (req, res) => {
    try {
        const { email, emailPassword } = req.body;
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email;
        user.emailPassword = emailPassword; // Store email password

        await user.save();

        res.json({ message: 'Email updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get user details by ID - protected route
app.get('/api/users/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
