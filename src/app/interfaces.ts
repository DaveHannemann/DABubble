export interface AuthenticationResult<T> {
  success: boolean;
  data?: T;
  errorMessage?: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  unmetCriteria: {
    missingLowercase?: string;
    missingUppercase?: string;
    missingNumber?: string;
    missingSpecialChar?: string;
    tooShort?: string;
    tooLong?: string;
  };
}
