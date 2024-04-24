const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (!authHeader) {
    return res.status(401).json("You are not authenticated!");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json("You are not authenticated!");
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) res.status(403).json("Token is not valid!");

    req.user = user;
    next();
  });
};

const authenticateTokenAndAuthorization = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (
      req.user.id.toString() === req.params.userId ||
      req.user.role === "admin"
    ) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const authenticateTokenAndId = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (JSON.stringify(req.user.id) === req.params.id) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};
const authenticateTokenAndUserId = (req, res, next) => {
  authenticateToken(req, res, () => {
    console.log(
      "(JSON.stringify(req.user.id) === req.params.userId ",
      JSON.stringify(req.user.id) === req.params.userId,
    );
    if (JSON.stringify(req.user.id) === req.params.userId) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const authenticateWishlist = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.id === req.body.userId) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const authenticateTokenAndAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

module.exports = {
  authenticateToken,
  authenticateTokenAndAuthorization,
  authenticateTokenAndAdmin,
  authenticateTokenAndId,
  authenticateTokenAndUserId,
  authenticateWishlist,
};
