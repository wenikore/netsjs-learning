//crear test
test('test is null',()=>{
    const n=null;

    expect(n).toBeNull();

});

test('sum(2+2)',()=>{
    const sum=2+2;
    expect(sum).toBe(4);
})