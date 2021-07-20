import styled from '@emotion/styled';

import { Label } from '@/components/Typography';

import { Colors, Fonts } from '@/assets/theme';

type FormProps = {
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: React.Dispatch<React.SetStateAction<any>>;
};

const defaultProps = {
    label: 'Label',
    type: 'text',
    placeholder: 'Add a placeholder',
};

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const FormInput = styled.input`
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: center;
    padding: 4px 12px;
    border: 1px solid ${Colors.border};
    border-radius: 4px;
    font-size: ${Fonts.sizes.input};
    &::placeholder {
        color: ${Colors.lightContent};
    }
`;

const FormItem = ({
    label,
    placeholder,
    value,
    type,
    onChange,
    ...props
}: FormProps): JSX.Element => {
    return (
        <Container {...props}>
            <Label style={{ marginBottom: '4px' }}>{label}</Label>
            <FormInput
                value={value}
                type={type}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </Container>
    );
};

FormItem.defaultProps = defaultProps;

export default FormItem;
