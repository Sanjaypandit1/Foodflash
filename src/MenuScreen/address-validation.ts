/**
 * Utility functions for address validation
 */

/**
 * Validates a phone number to ensure it starts with +977 and has 10 digits after
 * @param phone The phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export const validatePhoneNumber = (phone: string): boolean => {
    // Check if phone starts with +977 and has exactly 10 more digits
    const phoneRegex = /^\+977\d{10}$/
    return phoneRegex.test(phone)
  }
  
  /**
   * Formats a phone number to ensure it has the +977 prefix
   * @param phone The phone number to format
   * @returns Formatted phone number with +977 prefix
   */
  export const formatPhoneNumber = (phone: string): string => {
    // Remove any existing +977 prefix to avoid duplication
    const cleanPhone = phone.replace(/^\+977/, "")
  
    // Add the +977 prefix
    return "+977" + cleanPhone
  }
  
  /**
   * Validates an email to ensure it's a Gmail address
   * @param email The email to validate
   * @returns Boolean indicating if the email is valid
   */
  export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
    return emailRegex.test(email)
  }
  
  /**
   * Validates that all required address fields are filled
   * @param fields Object containing the address fields
   * @returns Boolean indicating if all required fields are filled
   */
  export const validateRequiredFields = (fields: {
    name: string
    fullName: string
    address: string
    phone: string
    email: string
  }): boolean => {
    return (
      !!fields.name.trim() &&
      !!fields.fullName.trim() &&
      !!fields.address.trim() &&
      !!fields.phone.trim() &&
      !!fields.email.trim()
    )
  }
  