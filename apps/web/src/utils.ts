export const generateRoomNumber = (): string => {
  // Generate a random number between 0 and 99999999
  const randomNumber = Math.floor(Math.random() * 100000000);
  
  // Pad with leading zeros to ensure 8 digits
  return randomNumber.toString().padStart(8, '0');
};