export function validateForm(fields: Record<string, string>) {
  const error: Record<string, string> = {};

  // Return early if fields is falsy
  if (!fields) {
    return null;
  }

  // Validate name
  if (fields.name) {
    if (fields.name.trim() === "") {
      error.name = "Name is required.";
    } else if (fields.name.length < 2) {
      error.name = "Name must be at least 2 characters long.";
    }
  }

  // Validate email
  if (fields.email) {
    if (fields.email.trim() === "") {
      error.email = "Email is required.";
    } else if (
      !/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(fields.email)
    ) {
      error.email = "Email address is invalid.";
    }
  }

  // Validate password
  if (fields.password) {
    if (fields.password.trim() === "") {
      error.password = "Password is required.";
    } else if (fields.password.length < 8) {
      error.password = "Password must be at least 8 characters long.";
    }
  }

  // Validate newPassword and confirmPassword together
  if (fields.newPassword && fields.confirmPassword) {
    if (!fields.newPassword) {
      error.newPassword = "New password is required.";
    } else if (fields.newPassword.length < 8) {
      error.newPassword = "New password must be at least 8 characters long.";
    }

    if (!fields.confirmPassword) {
      error.confirmPassword = "Confirm password is required.";
    } else if (fields.confirmPassword.length < 8) {
      error.confirmPassword =
        "Confirm password must be at least 8 characters long.";
    } else if (fields.confirmPassword !== fields.newPassword) {
      error.confirmPassword = "Passwords do not match.";
    }
  }

  return Object.keys(error).length ? error : null;
}
