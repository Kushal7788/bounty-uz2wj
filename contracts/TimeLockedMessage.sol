// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TimeLockedMessage {
    struct Message {
        string content;
        address sender;
        address recipient;
        uint256 unlockTime;
        bool isRetrieved;
    }
    
    mapping(bytes32 => Message) public messages;
    
    event MessageStored(bytes32 indexed messageId, address indexed sender, address indexed recipient, uint256 unlockTime);
    event MessageRetrieved(bytes32 indexed messageId, address indexed recipient);
    
    function storeMessage(
        string calldata _content,
        address _recipient,
        uint256 _unlockDelay
    ) external returns (bytes32) {
        require(_recipient != address(0), "Invalid recipient");
        require(_unlockDelay > 0, "Unlock delay must be greater than 0");
        
        bytes32 messageId = keccak256(abi.encodePacked(_content, msg.sender, _recipient, block.timestamp));
        
        messages[messageId] = Message({
            content: _content,
            sender: msg.sender,
            recipient: _recipient,
            unlockTime: block.timestamp + _unlockDelay,
            isRetrieved: false
        });
        
        emit MessageStored(messageId, msg.sender, _recipient, block.timestamp + _unlockDelay);
        return messageId;
    }
    
    function retrieveMessage(bytes32 _messageId) external view returns (string memory) {
        Message storage message = messages[_messageId];
        require(message.recipient == msg.sender, "Not the recipient");
        require(block.timestamp >= message.unlockTime, "Message is still locked");
        require(!message.isRetrieved, "Message already retrieved");
        
        return message.content;
    }
}