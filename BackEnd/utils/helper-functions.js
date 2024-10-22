import { Sequelize } from "sequelize";

export class HelperFunctions {
    getOptions = (where, pageIndex, pageSize, sortColumn, sortDirection) => {
        const options = {};

        // Where conditions
        options.where = where;

        // Pagination
        if (pageIndex && pageSize) {
            const offset = +pageIndex > 1 ? (+pageIndex - 1) * +pageSize : 0;

            options.limit = +pageSize;
            options["offset"] = offset;
        }

        // Sorting
        options.order = [
            Sequelize.literal(
                `${sortColumn || "createdAt"} ${sortDirection || "DESC"}`
            ),
        ];
        return options;
    };
}