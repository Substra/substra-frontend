def tabulate(table: list[list]) -> str:
    """
    left-aligns everything
    assumes length of each row is the same
    """
    assert isinstance(table, list)
    assert all(isinstance(row, list) for row in table)
    table = table.copy()

    max_row_len = max([len(row) for row in table])
    max_col_len = [0] * max_row_len

    for row in table:
        for index in range(len(row)):
            max_col_len[index] = max(max_col_len[index], len(str(row[index])))
        while len(row) < max_row_len:
            row.append("")

    fmt = " ".join([r"{:<" + str(col_len) + "}" for col_len in max_col_len])
    return "\n".join([fmt.format(*[str(item) for item in row]) for row in table])


def split_creds(creds) -> tuple:
    return tuple(creds.split(":", 1))
