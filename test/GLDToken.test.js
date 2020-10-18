const GLDToken = artifacts.require("GLDToken");

contract('GLDToken', accounts => {
    const _supply = 100000000000;
    
    beforeEach(async function() {
        this.token = await GLDToken.new(_supply)
    })

    describe('Token attributes', function(){
        it('Has the correct name', async function(){

        });
        it('Has the correct symbol', async function(){

        });
        it('Has the correct decimals', async function(){

        });
    })
})