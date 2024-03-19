export function checkUserDictDecorator(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any) {
        if (Object.keys(this.userDict).length === 0) {
            await this.createUserDict();
        }
        return originalMethod.apply(this, args);
    };
    return descriptor;
}

export function checkUserInDictDecorator(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any) {
        const userID = args[0];
        if (!this.userDict[userID]) {
            await this.createUserDict();
            if (!this.userDict[userID]) throw new Error('User not found');
        }
        return originalMethod.apply(this, args);
    };
    return descriptor;
}

export function checkAdminByIDDecorator(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any) {
        const userID = args[0];
        if (!(await this.checkAdminByID(userID))) {
            throw new Error('Permission denied');
        }
        return originalMethod.apply(this, args);
    };
    return descriptor;
}
