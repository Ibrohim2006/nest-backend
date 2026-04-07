import { DefaultNamingStrategy, NamingStrategyInterface, Table } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName?: string) {
    return customName || snakeCase(className);
  }

  columnName(
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[],
  ) {
    return (
      snakeCase(embeddedPrefixes.concat("").join("_")) +
      (customName || snakeCase(propertyName))
    );
  }

  relationName(propertyName: string) {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string) {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
  ) {
    return snakeCase(
      `${firstTableName}_${firstPropertyName.replace(/\./g, "_")}_${
        secondTableName
      }`,
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ) {
    return snakeCase(`${tableName}_${columnName || propertyName}`);
  }

  classTableInheritanceParentColumnName(
    parentTableName: string,
    parentTableIdPropertyName: string,
  ) {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string) {
    return `${alias}_${propertyPath.replace(".", "_")}`;
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace(".", "_");
    const key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
    return `${key}_pk`;
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace(".", "_");
    const key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
    return `${key}_uq`;
  }

  relationConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace(".", "_");
    let key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
    if (where) key += `_${where}`;

    return `${key}_rel`;
  }

  defaultConstraintName(
    tableOrName: Table | string,
    columnName: string,
  ): string {
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace(".", "_");
    const key = `${replacedTableName}_${columnName}`;
    return `${key}_df`;
  }

  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[],
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace(".", "_");
    const key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
    return `${key}_fk`;
  }

  indexName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace(".", "_");
    let key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
    if (where) key += `_${where}`;

    return `${key}_idx`;
  }
}

export const snakeNamingStrategy = new SnakeNamingStrategy();
