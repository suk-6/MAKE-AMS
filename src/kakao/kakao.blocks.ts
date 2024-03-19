export const kakaoBlocks = {
    sendQR: (userID: string) => [
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

    viewQR: (code: string) => [
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

    adminButton: (userID: string) => ({
        type: 'button',
        text: '관리자 메뉴',
        style: 'default',
        action: {
            type: 'submit_action',
            name: 'show_admin_menu',
            value: `user_id=${userID}`,
        },
    }),

    adminMenu: [
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
};
