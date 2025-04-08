const User = require('../models/auth');
const bcrypt = require('bcryptjs');

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// View Profile
const viewProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find user by ID, exclude the password field from the result
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({  message: 'Viewed profile successfully', data: user });
    } catch (error) {
        console.error("Error retrieving profile data:", error);
        res.status(500).json({ message: 'Failed to retrieve profile data' });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
    
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: 'Error changing password' });
    }
};

// Toggle Dark Mode
const changeTheme = async (req, res) => {
    try {
        const { theme } = req.body;
        const userId = req.user.id;

        const result = await User.updateOne({ _id: userId }, { theme: theme });
        if (result.nModified === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }

        res.json({ message: 'Dark mode setting updated successfully', theme: theme });
    } catch (error) {
        console.error("Dark mode setting error:", error);
        res.status(500).json({ message: 'Error updating dark mode setting' });
    }
};

// Toggle Language
const changeLanguage = async (req, res) => {
    try {
        const { isLangEnabled } = req.body;
        const userId = req.user.id;

        const result = await User.updateOne({ _id: userId }, { language: isLangEnabled });
        if (result.nModified === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }

        res.json({ message: 'Language setting updated successfully', language: isLangEnabled });
    } catch (error) {
        console.error("Language setting error:", error);
        res.status(500).json({ message: 'Error updating language setting' });
    }
};

// Help
const help = async (req, res) => {
    try {
        res.json({
            helpTopics: [
                {
                    title: "How to Submit a Complaint",
                    description: "To submit a complaint, go to the 'Submit Complaint' section, fill in the details of your issue, and click submit. Your complaint will be reviewed by the village administration."
                },
                {
                    title: "Tracking Your Complaint",
                    description: "Once your complaint is submitted, you can track its status in the 'My Complaints' section. You’ll receive updates as the complaint progresses."
                },
                {
                    title: "Editing Your Profile",
                    description: "You can edit your profile information by going to 'Settings' > 'Edit Profile'. Please note that some fields, such as your phone number, may not be editable."
                },
                {
                    title: "Contact Support",
                    description: "If you need assistance, please contact our support team through the 'Help' section or reach out to the app admin at +91 9876543210."
                },
                {
                    title: "Privacy and Data Security",
                    description: "Village Voice takes your privacy seriously. To learn more about how we handle your data, visit the 'Policies' section in the app."
                }
            ],
            lastUpdated: new Date().toISOString(),
            message: 'View help successfully'
        });
    } catch (error) {
        console.error("Error retrieving help topics:", error);
        res.status(500).json({ message: 'Error retrieving help topics' });
    }
};


// Policies
const policies = async (req, res) => {
    try {
        res.json({
            policies: {
                privacyPolicy: {
                    title: "Privacy Policy",
                    content: [
                        "Data Collection: We collect personal information such as your name, contact information, and location details solely to facilitate the services provided by Village Voice.",
                        "Data Usage: Personal information is used to process your complaints, improve the app’s functionality, and communicate important updates. Your data will not be sold or shared with third parties without your consent.",
                        "Data Security: We are committed to safeguarding your information. Our systems employ secure protocols to protect your data from unauthorized access or misuse.",
                        "Data Access: You may request to view, modify, or delete your data by contacting our support team."
                    ]
                },
                termsOfUse: {
                    title: "Terms of Use",
                    content: [
                        "Account Responsibility: Users are responsible for maintaining the security of their accounts. Please do not share login details with others.",
                        "Content Standards: When submitting complaints or feedback, users must adhere to respectful and constructive language. Offensive, discriminatory, or harmful content will not be tolerated.",
                        "Appropriate Usage: The app is intended to address local village issues. Please refrain from submitting complaints unrelated to community matters, as these will not be considered.",
                        "Termination of Access: Failure to follow these terms may result in restricted access to the app. Users who repeatedly violate our policies may be permanently removed."
                    ]
                },
                communityGuidelines: {
                    title: "Community Guidelines",
                    content: [
                        "Respect: Please treat all users, admins, and officials with respect. Harassment, threats, or abusive language toward others will lead to disciplinary action.",
                        "Accuracy: Ensure that the information provided in complaints is accurate and truthful. False information or malicious claims can harm the community and will not be tolerated.",
                        "Constructive Feedback: We encourage constructive criticism. However, users should refrain from personal attacks and focus on reporting issues that can positively impact the community."
                    ]
                },
                moderationPolicy: {
                    title: "Moderation Policy",
                    content: [
                        "Complaint Review: All complaints submitted via Village Voice will undergo review by the village administration or app moderators to ensure they meet community standards.",
                        "Removal of Inappropriate Content: Content that is deemed inappropriate or harmful may be removed without notice. Users will be notified if their content is removed due to a policy violation.",
                        "Report Misuse: If you encounter misuse or offensive content within the app, please report it. Our moderation team will take prompt action to address the issue."
                    ]
                },
                disclaimer: {
                    title: "Disclaimer",
                    content: [
                        "Information Accuracy: While we strive to keep all information up to date, Village Voice is not responsible for errors or omissions in content provided by users or third parties.",
                        "Service Limitations: Village Voice aims to assist with community issues, but we cannot guarantee resolution for all reported complaints. Actions taken on complaints are at the discretion of village administration and authorities."
                    ]
                }
            },
            message: 'View policies successfully'
        });
    } catch (error) {
        console.error("Error retrieving policies:", error);
        res.status(500).json({ message: 'Error retrieving policies' });
    }
};

// Report a Problem
const reportProblem = async (req, res) => {
    try {
        res.json({
            data: {
                user: 'If you encounter an issue related to Complaints, please contact the app admin at +91 9876543210. For application-related issues, please connect with the developer of Village Voice at +91 9876543210.',
                admin: 'For application-related issues, please connect with the developer of Village Voice at +91 9876543210.'
            },
            message: 'View report successfully'
        });
    } catch (error) {
        console.error("Error sending report details:", error);
        res.status(500).json({ message: 'Error sending report details' });
    }
};

module.exports = { updateProfile, viewProfile, changePassword, changeTheme, changeLanguage, help, policies, reportProblem };
