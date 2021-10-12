import {
    TableDrawerSection,
    TableDrawerSectionEntry,
} from './TableDrawerSection';

export default ({
    metadata,
}: {
    metadata: Record<string, string>;
}): JSX.Element => (
    <TableDrawerSection title="Metadata">
        {Object.entries(metadata).map(([key, value]) => (
            <TableDrawerSectionEntry title={key} key={key}>
                {value}
            </TableDrawerSectionEntry>
        ))}
        {Object.keys(metadata).length === 0 && (
            <TableDrawerSectionEntry title="No metadata set." />
        )}
    </TableDrawerSection>
);
