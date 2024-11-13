export interface UserJWTPayloadDto {
  id: string;
  email: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserBasicInfoDto {
  firstname: string;
  lastname: string;
  dateOfBirth: string;
}
