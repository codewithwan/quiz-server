import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetRoleDto {
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
    role: string;
}
