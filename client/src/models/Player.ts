import type {Hand} from "@/models/Hand";

export interface Player {
    Id: string;
    SocketId : string;
    Name : string;
    IsAdmin : boolean;
    Hands : Hand[];
}
