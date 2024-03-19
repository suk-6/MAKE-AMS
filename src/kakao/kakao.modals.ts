export const KakaoModals = {
    sendQRMessage: (value: string) => ({
        title: 'QR 발급 메세지 전송하기',
        accept: '전송',
        decline: '취소',
        value: value,
        blocks: [
            {
                type: 'label',
                text: 'QR 발급 안내 메세지 전송하기',
            },
            {
                type: 'select',
                name: 'sendType',
                options: [
                    {
                        text: '전체',
                        value: 'all',
                    },
                    {
                        text: '특정',
                        value: 'specific',
                    },
                ],
                required: true,
                placeholder: '옵션을 선택해주세요',
            },
            {
                type: 'input',
                name: 'name',
                required: false,
                placeholder: '(특정을 선택하셨을 경우) 이름을 입력해주세요.',
            },
        ],
    }),
};
