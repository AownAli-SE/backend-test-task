export const generateRandomPassword = () => {
  const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-";
  const charsLength = allowedChars.length;
  let password = "Ab2$";

  for (let i = 0; i < 10; i++) {
    const index = Math.floor(Math.random() * charsLength + 1);
    password += allowedChars[index];
  }

  return password;
};
