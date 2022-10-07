import { Select } from '@chakra-ui/react';

import { capitalize } from '@/libs/utils';
import { UserRolesT } from '@/modules/users/UsersTypes';

import { DrawerSectionEntry } from '@/components/DrawerSection';

type RoleInputProps = {
    value: UserRolesT;
    onChange: (value: UserRolesT) => void;
    isDisabled?: boolean;
};

const RoleInput = ({
    value,
    onChange,
    isDisabled,
}: RoleInputProps): JSX.Element => {
    return (
        <DrawerSectionEntry title="Role">
            <Select
                size="sm"
                id="role"
                value={value}
                onChange={(e) => onChange(e.target.value as UserRolesT)}
                isDisabled={isDisabled}
            >
                {Object.entries(UserRolesT).map(([key, type]) => (
                    <option key={key} value={type}>
                        {capitalize(key)}
                    </option>
                ))}
            </Select>
        </DrawerSectionEntry>
    );
};

export default RoleInput;
