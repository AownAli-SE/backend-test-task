export interface CreateOrUpdateCarDto {
  model: string;
  make: string;
  releasedYear: number;
  description: string;
  transmission: "Manual" | "Hybrid" | "Automatic" | "Electric";
  seatCapacity: number;
  color: string;
  registrationNumber: string;
  categoryId: string;
  userId: string;
}

export interface CarDto extends CreateOrUpdateCarDto {
  _id: string;
}
