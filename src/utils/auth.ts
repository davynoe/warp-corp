export const signOut = () => {
  // Remove user data from localStorage
  localStorage.removeItem("warp_user_data");
  // Redirect to home page
  window.location.href = "/";
};
