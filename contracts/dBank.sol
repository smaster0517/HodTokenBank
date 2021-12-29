// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
//import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

 contract dBank {

      mapping(address=>uint256) private balance;
      mapping(address=>bool) private isDeposited;
      mapping(address => uint256) private startTime;
      mapping(address => uint256) private expiredTime;
    address[] public userAccounts;

    uint256 public tax;
    address public  penalty_address;
    uint256 public fees;
    address public fees_address;

    event saveNow(
        uint indexed date, uint256 indexed amount, uint256 indexed expiryTime
    );

    event withdrawal(
        uint indexed date, uint256 indexed amount, uint256 indexed balance
    );

    event emergencyWithdrawal(
        uint indexed date, uint256 indexed balance 
    );
    event TransferSent(address _from, address _destAddr, uint _amount);


     function SaveNow( ) public payable {
         //uint256 minimumUsd = 50*10**18;
        //require(getConvertionRate(msg.value)>=minimumUsd, "your savings must be greater than 50usd");
      if(isDeposited[msg.sender]){
          //require(getTime(_expiredTime) >= expiredTime[msg.sender], 'your new start time is lower than your previous getExpiryTime');
          startTime[msg.sender]=blockTime();
         // expiredTime[msg.sender]=getTime(_expiredTime);
          balance[msg.sender]+=msg.value;

      }
      else{
       balance[msg.sender]+=msg.value;
       isDeposited[msg.sender]=true;
       startTime[msg.sender]=blockTime();
      // expiredTime[msg.sender]=getTime(_expiredTime);
       userAccounts.push(msg.sender);
        }

        emit saveNow(block.timestamp, msg.value,expiredTime[msg.sender]);

}

      function withdraw(uint256 _amount) public {
        // Note that "to" is declared as payable
        require(isDeposited[msg.sender], 'you currently  have No active deposite now, make a deposite');
//        require(expiredTime[msg.sender] <blockTime(), "Maturity time for withdrawal has not yet reached");
        require(balance[msg.sender] >= _amount,"amount your trying to withdraw is greater than your current balance");
        // apply fee for transaction      
        balance[msg.sender] -=_amount;
        uint256 feeAmount =_amount * fees/100;
        uint256 newAmount= _amount-feeAmount;
        
        if(balance[msg.sender]==0){
            isDeposited[msg.sender]=false;
            balance[msg.sender]=0;
            startTime[msg.sender]=0;
            // expiredTime[msg.sender]=0;
        
        }
        emit withdrawal(block.timestamp, newAmount, balance[msg.sender]);
         payable (msg.sender).transfer(newAmount);
        //payable(fees_address).transfer(feeAmount);
    }

    function emergencyWithdraw() public {
        // Note that "to" is declared as payable
        require(isDeposited[msg.sender], 'you currently  have No active deposite now, make a deposite');
       // require(expiredTime[msg.sender] > blockTime(), 'Avoid being, taxed use the withdraw method your timelock has expired!!');
        // apply fee for transaction      
        uint256 penaltyAmount = balance[msg.sender]*tax/100;
        uint256 newAmount= balance[msg.sender] - penaltyAmount;
          
        isDeposited[msg.sender]=false;
        balance[msg.sender]=0;
        startTime[msg.sender]=0;
        expiredTime[msg.sender]=0;

        emit emergencyWithdrawal(block.timestamp,  balance[msg.sender]);
         payable(msg.sender).transfer(newAmount);
        payable(penalty_address).transfer(penaltyAmount);   
    }
    
       function transferERC20(IERC20 token, address to, uint256 amount) public {
        uint256 erc20balance = token.balanceOf(msg.sender);
        require(amount <= erc20balance, "balance is low");
        token.transfer(to, amount);
        emit TransferSent(msg.sender, to, amount);
    }



    //    function getPrice()public view returns (uint256){
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    //     (,int price,,,
    //     )= priceFeed.latestRoundData();
    //     return uint256(price*1000000000);
    // }


    // function getConvertionRate(uint256 ethAmount) private view returns(uint256){
    //     uint256 ethPrice=getPrice();
    //     uint256 ethAmountInUSD =(ethPrice * ethAmount)/10**17;
    //     return ethAmountInUSD;
    // }

  

    function getContractBalance()public view returns (uint256){
       uint256 contbalance=address(this).balance;
        return contbalance;
    }


     function getDepStatus(address account) public view returns (bool){
      
      return isDeposited[account];
     }
     
     function getStartTime(address account) public view returns (uint256){
      
      return startTime[account];
     }

     
     function getExpiryTime(address account) public view returns (uint256){
      
      return expiredTime[account];
     }
     
     function getBalance(address account) public view returns (uint256){
      
      return balance[account];
     }


    function blockTime() public view returns (uint256){

         return block.timestamp;

    }


   
    function getTime (uint256 _expiredTime) private view returns(uint256 time){
        return block.timestamp + uint256 (_expiredTime);
    }

     function getUsers()public view returns(address  [] memory){
        return userAccounts;
    }


    function setFeeAddress(address _newAddress) external returns(address){
        return fees_address=_newAddress ;
    } 
  function setFees(uint256 _newfee) external returns(uint256){
        return fees=_newfee ;
    } 

     function setPenaltyAddress(address _newAddress) external returns(address){
        return penalty_address=_newAddress ;
    } 
  function settax(uint256 _newtax) external returns(uint256){
        return tax=_newtax ;
    } 



 }







 