import { Permission } from "src/permission/model/permission.entity";
export declare class Role {
    id: number;
    name: string;
    permission: Permission[];
}
