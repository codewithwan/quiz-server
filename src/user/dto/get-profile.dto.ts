import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetProfileDto {
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    data: DataDto;
}

class DataDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    created_at: Date;
}
