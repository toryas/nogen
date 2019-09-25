import * as loggerUtils from "./logger.util";

describe("Unit test Logger Utils",()=>{

    test("should be return a logger",()=>{
        
    });

    test("should be return a logger",()=>{
        let string = "un \r\ndia \nvi";
        let newString = loggerUtils.errorToOneLine(string);
        expect(newString).toBe("un dia vi");
    });

});