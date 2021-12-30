// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20//IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HodleBank is Ownable{
    IERC20 token;

    struct LockBoxStruct {
        address beneficiary;
        IERC20 token;
        uint balance;
        uint releaseTime;
        bool status;
    }

    struct LockBoxCoin{
        address beneficiary;
        string coinName;
        uint256 balance;
        uint256 releaseTime;
        bool status;
        }
    address public feeAddress =payable (0xe746c78Cc74f81cAB77eecB9aaBbc137Be43d5d6);
    uint public tax= 0;
    uint  public fee= 0;

    LockBoxCoin[] public lockCoins;
    LockBoxStruct[] public lockBoxStructs; // This could be a mapping by address, but these numbered lockBoxes support possibility of multiple tranches per address

    event LogLockBoxDeposit(address sender, uint amount, uint releaseTime);   
    event LogLockBoxWithdrawal(address receiver, uint amount);
    event LogLockCoinDeposit(address sender, uint amount, uint releaseTime);  
    event LogLockCoinWithdrawal(address receiver, uint amount);
    event LogLockCoinUpdate(address sender, uint amount, uint releaseTime); 
    event LogLockTokenUpdate(address sender, uint amount, uint releaseTime);
    event LogFeeAddress(address feeAddress, address _newFeeAddress);
    event LogEmergencyTax(uint tax, uint newTax);
    event LogFee(uint fee, uint newFee);
    
 

 // Token Deposit And WithDrawal  
    function deposit(IERC20 _tokenAddress, uint amount, uint releaseTime)public returns(bool success) {
    require(_tokenAddress.transferFrom(msg.sender, address(this), amount));
        LockBoxStruct memory lock;
        lock.beneficiary = msg.sender;
        lock.token= _tokenAddress;
        lock.balance = amount;
        lock.releaseTime = releaseTime;
        lock.status=true;
        lockBoxStructs.push(lock);
        emit LogLockCoinDeposit(msg.sender, amount, releaseTime);
        return true;
    }

     function UpdateLocktToken(uint vaultNumber, uint256 amount, uint256 releaseTime)public payable returns(bool success) {
        LockBoxStruct storage locker = lockBoxStructs[vaultNumber];
        require ( locker.beneficiary == msg.sender, "your Not the Owner Of The Vault Your Trying To Update");
        require (locker.releaseTime <= releaseTime,"New Release Time Must Be Higher Than Previous Release Time");
            locker.balance += amount;
            locker.releaseTime =releaseTime;
            emit LogLockTokenUpdate(msg.sender, amount, releaseTime);
            return true;
        }

    function withdraw(uint vaultNumber) public returns(bool success) {
        LockBoxStruct storage lock = lockBoxStructs[vaultNumber];
        require(lock.beneficiary == msg.sender, "Your are not the owner of this, or check your LockID and try again");
        require(lock.releaseTime <= block.timestamp , "Time have not expired");
        uint amount = lock.balance;
        lock.balance = 0;
        lock.status=false;
        uint feeAmount= amount *fee/100;
        uint newAmount =amount-feeAmount;
        emit LogLockCoinWithdrawal(msg.sender, newAmount);
        require(lock.token.transfer(msg.sender, newAmount), "Token transfered");
        require(lock.token.transfer(feeAddress, feeAmount), "Token transfered");
        return true;
    }    


       function emergencyTokenWithdrawal(uint vaultNumber) public returns(bool success) {
        LockBoxStruct storage lock = lockBoxStructs[vaultNumber];
        require(lock.beneficiary == msg.sender, "Your are not the owner of this, or check your LockID and try again");
        uint amount = lock.balance;
        lock.balance = 0;
        lock.status=false;
        uint taxAmount= amount *tax/100;
        uint newAmount =amount-taxAmount;
        emit LogLockCoinWithdrawal(msg.sender, newAmount);
        require(lock.token.transfer(msg.sender, newAmount), "Token transfered");
        require(lock.token.transfer(feeAddress, taxAmount), "Token transfered");
        return true;
    } 
/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
                              // Native Coin Deposit And WithDrawal
*/                              

    function depositCoin( uint256 amount, uint256 releaseTime,string memory coinSymbol)public payable returns(bool success) {
        LockBoxCoin memory locker;
        locker.beneficiary = msg.sender;
        locker.coinName= coinSymbol;
        locker.balance = amount;
        locker.releaseTime = releaseTime;
        locker.status=true;
        lockCoins.push(locker);
        emit LogLockCoinDeposit(msg.sender, amount, releaseTime);
        return true;
    }

    function withdrawCoin(uint vaultNumber) public returns(bool success) {
        LockBoxCoin storage lock = lockCoins[vaultNumber];
        require(lock.beneficiary == msg.sender, "Your are not the owner of this, or check your LockID and try again");
        require(lock.releaseTime <= block.timestamp , "Release Time have not expired");
        uint256 amount = lock.balance;
        uint feeAmount= amount *fee/100;
        uint newAmount =amount-feeAmount;
        lock.balance = 0;
        lock.status=false;
        emit LogLockBoxWithdrawal(msg.sender, newAmount);
       payable(msg.sender).transfer( newAmount);
       payable(feeAddress).transfer( feeAmount);
        return true;
    }   

     function emergencyCoinWithdrawal(uint vaultNumber) public returns(bool success) {
        LockBoxCoin storage lock = lockCoins[vaultNumber];
        require(lock.beneficiary == msg.sender, "Your are not the owner of this, or check your LockID and try again");
        uint256 amount = lock.balance;
        uint taxAmount= amount *tax/100;
        uint newAmount =amount-taxAmount;
        lock.balance = 0;
        lock.status=false;
        emit LogLockBoxWithdrawal(msg.sender, newAmount);
       payable(msg.sender).transfer( newAmount);
       payable(feeAddress).transfer( taxAmount);
        return true;
    }  

    function UpdateLocktCoin(uint vaultNumber, uint256 amount, uint256 releaseTime)public payable returns(bool success) {
        LockBoxCoin storage locker = lockCoins[vaultNumber];
        require ( locker.beneficiary == msg.sender, "your Not the Owner Of The Vault Your Trying To Update");
        require (locker.releaseTime <= releaseTime,"New Release Time Must Be Higher Than Previous Release Time");
            locker.balance += amount;
            locker.releaseTime =releaseTime;
            emit LogLockCoinUpdate(msg.sender, amount, releaseTime);
            return true;
        }


    function setFeeAddress(address payable _newFeeAddress) external onlyOwner  returns(address){
        emit LogFeeAddress( feeAddress, _newFeeAddress);
        return feeAddress = payable (_newFeeAddress);

    }

    function setEmergencyTax(uint newTax) external onlyOwner returns(uint){
      emit LogEmergencyTax( tax, newTax);  
    return tax= newTax;
    }
    function setFee(uint newFee) external onlyOwner returns(uint){
        emit LogFee(fee, newFee);
        return fee =newFee;
    }

    // function getTime (uint256 _time) private view returns(uint256 time){
    //     return block.timestamp + _time;
    // }

    function getStructBoxLenght () public view returns (uint256){
       return lockBoxStructs.length;
   }

     function getCoinBoxLenght () public view returns (uint256){
       return lockCoins.length;
   }

}