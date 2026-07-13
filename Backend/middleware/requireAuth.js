import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. Please log in." });
    }

    const token = authHeader.split(" ")[1];

    try {
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        req.user = decoded; 
      
        next(); 
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token. Please log in again." });
    }
};

export default requireAuth;