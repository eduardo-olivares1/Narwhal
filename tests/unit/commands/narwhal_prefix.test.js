const NarwhalPrefix = require('../../../commands/narwhal_prefix');

class MockPrefixService {
    constructor() {
        this.prefix = '';
    }

    put(prefix){
        this.prefix = prefix
    }
}

class MockMessage {
    constructor(roleNames=[]) {
        this.msg = ''
        this.memberRoles = roleNames.map((r) => {
            return {
                name: r
            }
        })
        this.channel = {
            send: (msg) => {
                this.msg = msg
            }
        }
    
        this.member = {
            roles: {
                cache: this.memberRoles
            }
        }
    }
}

describe("Narhwal Prefix Command", () => {
    test('No arguments should result in an early out with an error message sent', async () => {
        const mockPrefixService = new MockPrefixService();
        const narwhalPrefix = new NarwhalPrefix({prefixService: mockPrefixService});
        const mockMessage = new MockMessage();

        await narwhalPrefix.execute(mockMessage, []);
        expect(mockMessage.msg).toBe('EHHHHH...Use it like this: <current prefix>narwhalPrefix <new prefix>');
    });

    test('More than 1 argument should result in an early out with error message sent', async() => {
        const mockPrefixService = new MockPrefixService();
        const narwhalPrefix = new NarwhalPrefix({prefixService: mockPrefixService});
        const mockMessage = new MockMessage();

        await narwhalPrefix.execute(mockMessage, [1, 1]);
        expect(mockMessage.msg).toBe('EHHHHH...Use it like this: <current prefix>narwhalPrefix <new prefix>');
    })

    test('Correct number of arguments but incorrect roles should result in an early out with an error message sent', async () => {
        const mockPrefixService = new MockPrefixService();
        const narwhalPrefix = new NarwhalPrefix({prefixService: mockPrefixService});
        const mockMessage = new MockMessage(['Lol']);
    
        await narwhalPrefix.execute(mockMessage, ['~']);
        expect(mockMessage.msg).toBe('You do not have permissions to change this.');
    });

    test.each([
        'FakeAdmin1',
        'FakeAdmin2'
    ])('Correct roles and number of arguments should result in prefix change.', async (role) => {
        const mockPrefixService = new MockPrefixService();
        const narwhalPrefix = new NarwhalPrefix({prefixService: mockPrefixService});
        const mockMessage = new MockMessage([role]);
        expect(mockPrefixService.prefix).not.toBe('~');
        await narwhalPrefix.execute(mockMessage, ['~']);
        expect(mockMessage.msg).toBe('You may now speak to me using ~');
        expect(mockPrefixService.prefix).toBe('~');
    });
})
