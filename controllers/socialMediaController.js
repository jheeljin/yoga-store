// import SocialMediaLink from '../models/socialMediaModel.js';


// // Controller to fetch all social media links
// const getSocialMediaLinks = async (req, res) => {
//     try {
//         const links = await SocialMediaLink.find(); // Get all social media links
//         res.json(links); // Return the links as JSON
//     } catch (error) {
//         console.error("Error fetching social media links:", error); // Log the error to the console
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

// const addSocialMediaLink = async (req, res) => {
//     const { platform, url } = req.body;

//     if (!platform || !url) {
//         return res.status(400).json({ message: "Platform and URL are required" });
//     }

//     try {
//         const newLink = new SocialMediaLink({ platform, url });
//         await newLink.save(); // Save the new link to the database
//         res.status(201).json(newLink); // Return the created link
//     } catch (error) {
//         console.error("Error adding social media link:", error); // Log the error to the console
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };


