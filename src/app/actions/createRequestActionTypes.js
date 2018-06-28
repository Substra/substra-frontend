export default (base, types = ['REQUEST', 'SUCCESS', 'FAILURE']) =>
    types.reduce((requestTypes, type) => (
        {...requestTypes, [type]: `${base}_${type}`}
    ), {});
