// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20//IERC20.sol";

contract TimeLock {
    IERC20 token;

    struct LockBoxStruct {
        address beneficiary;
        IERC20 tokenAddress;
        uint balance;
        uint releaseTime;
    }

    struct LockBoxCoin{
        address beneficiary;
        string coinName;
        uint256 balance;
        uint256 releaseTime;
        }

    LockBoxCoin[] public lockCoins;
    LockBoxStruct[] public lockBoxStructs; // This could be a mapping by address, but these numbered lockBoxes support possibility of multiple tranches per address

    event LogLockBoxDeposit(address sender, uint amount, uint releaseTime);   
    event LogLockBoxWithdrawal(address receiver, uint amount);
    event LogLockCoinDeposit(address sender, uint amount, uint releaseTime);  
    event LogLockCoinWithdrawal(address receiver, uint amount);
 

 // Token Deposit And WithDrawal  
    function deposit(IERC20 _tokenAddress, uint amount, uint releaseTime)public returns(bool success) {
    require(_tokenAddress.transferFrom(msg.sender, address(this), amount));
        LockBoxStruct memory lock;
        lock.beneficiary = msg.sender;
        lock.tokenAddress= _tokenAddress;
        lock.balance = amount;
        lock.releaseTime = releaseTime;
        lockBoxStructs.push(lock);
        emit LogLockCoinDeposit(msg.sender, amount, releaseTime);
        return true;
    }

    function withdraw(uint lockBoxNumber) public returns(bool success) {
        LockBoxStruct storage lock = lockBoxStructs[lockBoxNumber];
        require(lock.beneficiary == msg.sender, "Your are not the owner of this, or check your LockID and try again");
        require(block.timestamp >=lock.releaseTime, "Time hav not expired");
        require(lock.balance > 0, "You dont Have Sufficient Balance");
        uint amount = lock.balance;
        lock.balance = 0;
        emit LogLockCoinWithdrawal(msg.sender, amount);
        require(token.transfer(msg.sender, amount), "Token transfered");
        return true;
    }    



    function getStructBoxLenght () public view returns (uint256){
       return lockBoxStructs.length;
   }



   // Native Coin Deposit And WithDrawal

    function depositCoin( uint256 amount, uint256 releaseTime,string memory coinSymbol)public payable returns(bool success) {
        LockBoxCoin memory locker;
        locker.beneficiary = msg.sender;
        locker.coinName= coinSymbol;
        locker.balance = amount;
        locker.releaseTime = releaseTime;
        lockCoins.push(locker);
        emit LogLockCoinDeposit(msg.sender, amount, releaseTime);
        return true;
    }



    function withdrawCoin(uint vaultNumber) public returns(bool success) {
        LockBoxCoin storage lock = lockCoins[vaultNumber];
        require(lock.beneficiary == msg.sender, "Your are not the owner of this, or check your LockID and try again");
        require(lock.releaseTime <= block.timestamp , "Time hav not expired");
        uint256 amount = lock.balance;
        lock.balance = 0;
        emit LogLockBoxWithdrawal(msg.sender, amount);
       payable(msg.sender).transfer( amount);
        return true;
    }    

    function getCoinBoxLenght () public view returns (uint256){
       return lockCoins.length;
   }

}