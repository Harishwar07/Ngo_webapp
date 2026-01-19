import csrf from "csurf";

export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,                // JS cannot read
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  }
});
