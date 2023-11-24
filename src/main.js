/// <reference path="eidos.d.ts" />
export default async function (input, context) {
    console.log("Hello Eidos!");
    const tableName = context.tables.todo.name;
    const fieldMap = context.tables.todo.fieldsMap;
    const res = await eidos.currentSpace.addRow(tableName, {
        [fieldMap.title]: input.content,
    });
    console.log(res);
}
