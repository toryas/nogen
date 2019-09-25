import * as jsonUtil from "./json.util";

describe("Unit Test JSON Util",()=>{


    test("sould be identify a  object node",()=>{
        let badJson = {
            node1:"string",
            node2:123,
            node3:process.env.SIN_DEFINIR,
            node4:{
                subNode:"string"
            },
            node5:[1,2,3]
        }
        let goodJson = {
            node1:2,
            node2:{
                data:["uno","dos"],
                other:222
            },
            node3:{
                dd:"123"
            },
            node4:"un dato"
        }
        let check = jsonUtil.isFullDefined(badJson);
        let check2 = jsonUtil.isFullDefined(goodJson);
        expect(check).toBe(false);
        expect(check2).toBe(true);
    });

    test("sould be determiante element type",()=>{
        let nulo = null;
        let unfed;
        let string = "string";
        let array = [1,2,3];
        let json = {dato:"dato"};
        let number = 1;

        let rNulo = jsonUtil.elementType(nulo);
        let rUnfed = jsonUtil.elementType(unfed);
        let rString = jsonUtil.elementType(string);
        let rArray = jsonUtil.elementType(array);
        let rJson = jsonUtil.elementType(json);
        let rNumber = jsonUtil.elementType(number);

        expect(rNulo).toBe("null");
        expect(rUnfed).toBe("undefined");
        expect(rString).toBe("string");
        expect(rArray).toBe("array");
        expect(rJson).toBe("object");
        expect(rNumber).toBe("number");
        
    })

});