export interface KakaoUserModel {
    avatar_url?: string;
    department?: string;
    display_name: string;
    emails: string[];
    id: string;
    identifications: object[];
    mobiles?: string[];
    name: string;
    nickname?: string;
    position?: string;
    responsibility?: string;
    space_id?: string;
    status: string;
    tels?: string[];
    vacation_end_time?: string;
    vacation_start_time?: string;
    work_end_time?: string;
    work_start_time?: string;
}

export interface KakaoCallbackModel {
    type: string;
    action_time: string;
    message: {
        blocks: object[];
        conversation_id: number;
        id: number;
        text: string;
        user_id: number;
    };
    react_user_id: number;
    action_name: string;
    value: string;
}
