/**
 * Toast notification component
 * Shows success messages to users
 */

import toast from "react-hot-toast";

function showToast(message) {
  toast.success(message);
}

export default showToast;