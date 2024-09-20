export type actions = {
    label: string;
    value: string;
}

export type iconList = {
    isActive?: boolean;
} & actions

export type zoom_jwt_payload = {
    interview_id: string;
    candidate_id: string;
    candidate_name: string;
}