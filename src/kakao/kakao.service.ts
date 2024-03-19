import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class KakaoService {
    constructor(private readonly authService: AuthService) {}

    private static baseURL = 'https://api.kakaowork.com/v1';
    private headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.KAKAOBOT_API_KEY}`,
    };
    public userDict = {};

    public async getUser(userID: number) {
        const res = await fetch(
            `${KakaoService.baseURL}/users.info?user_id=${userID}`,
            {
                method: 'GET',
                headers: this.headers,
            },
        );
        if (!res.ok) throw new Error('Failed to fetch user info');

        const data = await res.json();
        if (!data.success) throw new Error('Failed to fetch user info');

        return data.user;
    }

    public async getUserIDAll() {
        const res = await fetch(
            `${KakaoService.baseURL}/users.list?limit=100`,
            {
                method: 'GET',
                headers: this.headers,
            },
        );
        if (!res.ok) throw new Error('Failed to fetch user list');

        const data = await res.json();
        if (!data.success) throw new Error('Failed to fetch user list');

        return data.users
            .map((user: any) => {
                if (user.department !== 'Teacher') return parseInt(user.id);
            })
            .filter((id: number) => id)
            .filter((id: number) => id === 10203314);
    }

    public async sendCode(userID: number, code: string) {
        const body = {
            conversation_id: await this.getConversation(userID),
            text: `새로운 QR 코드가 발급되었습니다.`,
            blocks: [
                {
                    type: 'header',
                    text: '메이커스페이스 출입관리 시스템',
                    style: 'blue',
                },
                {
                    type: 'text',
                    text: '새로운 QR 코드가 발급되었습니다.',
                },
                {
                    type: 'button',
                    text: '표시하기',
                    style: 'default',
                    action: {
                        type: 'open_system_browser',
                        name: 'open',
                        value: `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${code}`,
                    },
                },
            ],
        };

        if (await this.authService.checkAdmin(userID)) {
            body.blocks.push({
                type: 'button',
                text: '관리자 메뉴',
                style: 'default',
                action: {
                    type: 'submit_action',
                    name: 'show_admin_menu',
                    value: `user_id=${userID}`,
                },
            });
        }

        const res = await fetch(`${KakaoService.baseURL}/messages.send`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to send code');
    }

    public async getConversation(userID: number) {
        const res = await fetch(`${KakaoService.baseURL}/conversations.open`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ user_id: userID }),
        });
        if (!res.ok) throw new Error('Failed to open conversation');

        const data = await res.json();
        if (!data.success) throw new Error('Failed to open conversation');

        return data.conversation.id;
    }

    public async createUserDict() {
        const userIDs = await this.getUserIDAll();
        for (const userID of userIDs) {
            this.userDict[userID] = await this.getConversation(userID);
        }
    }

    public async generationMessageAll() {
        for (const userID of Object.keys(this.userDict)) {
            fetch(`${KakaoService.baseURL}/messages.send`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    conversation_id: this.userDict[userID],
                    text: '메이커스페이스 출입 QR을 발급받으세요.',
                    blocks: [
                        {
                            type: 'header',
                            text: '메이커스페이스 출입관리 시스템',
                            style: 'blue',
                        },
                        {
                            type: 'text',
                            text: '아래 버튼을 눌러 메이커스페이스 출입 QR을 발급받으세요.',
                        },
                        {
                            type: 'button',
                            text: '발급하기',
                            style: 'default',
                            action: {
                                type: 'submit_action',
                                name: 'generation',
                                value: `user_id=${userID}`,
                            },
                        },
                    ],
                }),
            });
        }
    }

    public async sendAdminMenu(userID: number) {
        const res = await fetch(`${KakaoService.baseURL}/messages.send`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                conversation_id: this.userDict[userID],
                text: '관리자 메뉴',
                blocks: [
                    {
                        type: 'header',
                        text: '메이커스페이스 출입관리 관리자',
                        style: 'blue',
                    },
                    {
                        type: 'text',
                        text: '메뉴를 선택해주세요.',
                    },
                    {
                        type: 'action',
                        elements: [
                            {
                                type: 'button',
                                text: '열기',
                                style: 'primary',
                                action: {
                                    type: 'open_system_browser',
                                    name: 'button1',
                                    value: 'http://example.com/details/999',
                                },
                            },
                            {
                                type: 'button',
                                text: '잠그기',
                                style: 'danger',
                                action: {
                                    type: 'open_system_browser',
                                    name: 'button1',
                                    value: 'http://example.com/details/999',
                                },
                            },
                        ],
                    },
                    {
                        type: 'button',
                        text: '출입기록 확인하기',
                        style: 'default',
                        action: {
                            type: 'open_system_browser',
                            name: 'button1',
                            value: 'http://example.com/details/999',
                        },
                    },
                    {
                        type: 'button',
                        text: 'QR 발급 메세지 전송하기',
                        style: 'default',
                        action: {
                            type: 'open_system_browser',
                            name: 'button1',
                            value: 'http://example.com/details/999',
                        },
                    },
                ],
            }),
        });

        if (!res.ok) throw new Error('Failed to send admin menu');
    }
}

// (() => {
//     const kakaoService = new KakaoService();
//     kakaoService.createUserDict().then(() => {
//         kakaoService.generationMessageAll();
//     });
// })();
