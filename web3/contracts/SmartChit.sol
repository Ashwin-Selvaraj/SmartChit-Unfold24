// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SmartChit {
    struct Member {
        address payable account;
        bool hasPaid;
    }

    struct Pool {
        address organizer;
        string name;
        string details;
        uint256 totalPoolValue;
        uint256 paymentPerInstallment;
        uint256 installmentInterval;
        uint256 maxMembers;
        uint256 currentRound;
        uint256 endTime;
        Member[] members;
    }

    mapping(uint256 => Pool) public pools;

    uint256 public poolCount;

    function createPool(
        string memory _name,
        string memory _details,
        uint256 _totalPoolValue,
        uint256 _paymentPerInstallment,
        uint256 _installmentInterval,
        uint256 _maxMembers,
        uint256 _endTime
    ) public returns (uint256) {
        require(
            _totalPoolValue % _maxMembers == 0,
            "Pool value must be divisible by member count"
        );
        require(
            _paymentPerInstallment % _maxMembers == 0,
            "Installment must be divisible by member count"
        );
        require(_endTime > block.timestamp, "End time must be in the future");

        Pool storage newPool = pools[poolCount];

        newPool.organizer = msg.sender;
        newPool.name = _name;
        newPool.details = _details;
        newPool.totalPoolValue = _totalPoolValue;
        newPool.paymentPerInstallment = _paymentPerInstallment;
        newPool.installmentInterval = _installmentInterval;
        newPool.maxMembers = _maxMembers;
        newPool.currentRound = 1;
        newPool.endTime = _endTime;
        newPool.members.push(Member(payable(msg.sender), false));

        poolCount++;

        return poolCount - 1;
    }

    function joinPool(uint256 _poolId) public {
        Pool storage pool = pools[_poolId];

        require(pool.currentRound == 1, "Pool has already started");
        require(
            pool.members.length < pool.maxMembers,
            "Pool is already at full capacity"
        );

        pool.members.push(Member(payable(msg.sender), false));

        if (pool.members.length == pool.maxMembers) {
            pool.currentRound++;
        }
    }

    function contribute(uint256 _poolId) external payable {
        Pool storage pool = pools[_poolId];

        require(pool.currentRound > 1, "Pool is not yet active");
        require(block.timestamp <= pool.endTime, "Contribution period is over");

        uint256 memberIndex = findMember(pool);

        require(memberIndex != pool.maxMembers, "Not a registered member");
        require(!pool.members[memberIndex].hasPaid, "Payment already made");
        require(
            msg.value == pool.paymentPerInstallment,
            "Incorrect payment amount"
        );

        pool.members[memberIndex].hasPaid = true;

        if (pool.currentRound == pool.maxMembers + 1) {
            pool.currentRound = 1;
            pool.endTime = block.timestamp + pool.installmentInterval;
        } else {
            pool.currentRound++;
        }
    }

    function withdrawFunds(uint256 _poolId) public {
        Pool storage pool = pools[_poolId];

        uint256 memberIndex = findMember(pool);

        require(memberIndex != pool.maxMembers, "Not a member of this pool");
        require(pool.currentRound == 1, "Pool is not yet completed");

        pool.members[memberIndex].account.transfer(pool.totalPoolValue);
        pool.members[memberIndex].hasPaid = false;
    }

    function getAllMembers(
        uint256 _poolId
    ) public view returns (Member[] memory) {
        return pools[_poolId].members;
    }

    function getMaxMembers(uint256 _poolId) public view returns (uint256) {
        return pools[_poolId].maxMembers;
    }

    function getAllPools() public view returns (Pool[] memory) {
        Pool[] memory activePools = new Pool[](poolCount);

        for (uint256 i = 0; i < poolCount; i++) {
            activePools[i] = pools[i];
        }

        return activePools;
    }

    function getPoolBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function transferFunds(address payable _recipient, uint256 _amount) public {
        _recipient.transfer(_amount);
    }

    function findMember(Pool storage pool) private view returns (uint256) {
        for (uint256 i = 0; i < pool.members.length; i++) {
            if (pool.members[i].account == msg.sender) {
                return i;
            }
        }
        return pool.maxMembers;
    }
}
