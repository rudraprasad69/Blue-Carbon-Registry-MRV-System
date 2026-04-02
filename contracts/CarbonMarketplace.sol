// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CarbonCredit.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

/**
 * @title CarbonMarketplace
 * @dev Decentralized marketplace for trading blue carbon credits
 * Supports buying/selling, order books, and price discovery
 */
contract CarbonMarketplace {
    
    CarbonCredit public carbonCreditToken;
    IERC20 public stablecoin; // USDC or USDT
    address public admin;
    uint256 public platformFeePercent = 2; // 2% platform fee
    uint256 public totalVolumeTraded;
    
    // Order tracking
    uint256 private orderIdCounter;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    
    // Trade history
    Trade[] public tradeHistory;
    
    // Price tracking
    uint256 public lastPrice = 15 * 10 ** 18; // $15 initial price
    uint256 public highPrice24h = 15 * 10 ** 18;
    uint256 public lowPrice24h = 15 * 10 ** 18;
    
    enum OrderType { BUY, SELL }
    enum OrderStatus { OPEN, FILLED, CANCELLED }
    
    event OrderCreated(
        uint256 indexed orderId,
        address indexed user,
        OrderType orderType,
        uint256 amount,
        uint256 pricePerCredit
    );
    
    event OrderFilled(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 pricePerCredit
    );
    
    event OrderCancelled(uint256 indexed orderId);
    
    event PriceUpdated(uint256 newPrice, uint256 timestamp);
    
    event TradeExecuted(
        address indexed buyer,
        address indexed seller,
        uint256 creditAmount,
        uint256 totalPrice,
        uint256 timestamp
    );
    
    struct Order {
        uint256 orderId;
        address user;
        OrderType orderType;
        uint256 creditAmount;
        uint256 creditAmountFilled;
        uint256 pricePerCredit; // in USDC/USDT (wei)
        OrderStatus status;
        uint256 createdAt;
        uint256 expiresAt;
    }
    
    struct Trade {
        address buyer;
        address seller;
        uint256 creditAmount;
        uint256 pricePerCredit;
        uint256 totalPrice;
        uint256 timestamp;
        uint256 buyOrderId;
        uint256 sellOrderId;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    constructor(
        address _carbonCreditToken,
        address _stablecoin
    ) {
        carbonCreditToken = CarbonCredit(_carbonCreditToken);
        stablecoin = IERC20(_stablecoin);
        admin = msg.sender;
    }
    
    /**
     * @dev Create a buy or sell order
     * @param orderType BUY or SELL
     * @param creditAmount Number of credits
     * @param pricePerCredit Price in USDC/USDT per credit
     */
    function createOrder(
        OrderType orderType,
        uint256 creditAmount,
        uint256 pricePerCredit
    ) external returns (uint256 orderId) {
        
        require(creditAmount > 0, "Amount must be > 0");
        require(pricePerCredit > 0, "Price must be > 0");
        
        // Validate balances
        if (orderType == OrderType.SELL) {
            require(
                carbonCreditToken.balanceOf(msg.sender) >= creditAmount * 10 ** 18,
                "Insufficient carbon credits"
            );
        } else {
            require(
                stablecoin.balanceOf(msg.sender) >= creditAmount * pricePerCredit,
                "Insufficient stablecoin balance"
            );
        }
        
        orderId = orderIdCounter++;
        
        orders[orderId] = Order({
            orderId: orderId,
            user: msg.sender,
            orderType: orderType,
            creditAmount: creditAmount,
            creditAmountFilled: 0,
            pricePerCredit: pricePerCredit,
            status: OrderStatus.OPEN,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + 30 days
        });
        
        userOrders[msg.sender].push(orderId);
        
        emit OrderCreated(orderId, msg.sender, orderType, creditAmount, pricePerCredit);
        
        // Try to match orders
        _matchOrders(orderId);
        
        return orderId;
    }
    
    /**
     * @dev Match buy and sell orders
     */
    function _matchOrders(uint256 newOrderId) internal {
        Order storage newOrder = orders[newOrderId];
        
        for (uint256 i = 0; i < orderIdCounter; i++) {
            if (i == newOrderId || orders[i].status != OrderStatus.OPEN) continue;
            
            Order storage existingOrder = orders[i];
            
            // Check if orders can be matched
            if (newOrder.orderType == OrderType.BUY && existingOrder.orderType == OrderType.SELL &&
                existingOrder.pricePerCredit <= newOrder.pricePerCredit) {
                
                _executeMatch(newOrderId, i);
                
                if (newOrder.creditAmountFilled == newOrder.creditAmount) {
                    newOrder.status = OrderStatus.FILLED;
                    break;
                }
                
            } else if (newOrder.orderType == OrderType.SELL && existingOrder.orderType == OrderType.BUY &&
                newOrder.pricePerCredit <= existingOrder.pricePerCredit) {
                
                _executeMatch(newOrderId, i);
                
                if (newOrder.creditAmountFilled == newOrder.creditAmount) {
                    newOrder.status = OrderStatus.FILLED;
                    break;
                }
            }
        }
    }
    
    /**
     * @dev Execute matched orders
     */
    function _executeMatch(uint256 buyOrderId, uint256 sellOrderId) internal {
        Order storage buyOrder = orders[buyOrderId];
        Order storage sellOrder = orders[sellOrderId];
        
        if (buyOrder.orderType == OrderType.SELL) {
            (buyOrderId, sellOrderId) = (sellOrderId, buyOrderId);
            (buyOrder, sellOrder) = (orders[buyOrderId], orders[sellOrderId]);
        }
        
        uint256 amountToMatch = buyOrder.creditAmount - buyOrder.creditAmountFilled;
        amountToMatch = amountToMatch < (sellOrder.creditAmount - sellOrder.creditAmountFilled) 
            ? amountToMatch 
            : (sellOrder.creditAmount - sellOrder.creditAmountFilled);
        
        uint256 pricePerCredit = sellers[sellOrderId];
        uint256 totalCost = amountToMatch * pricePerCredit;
        uint256 platformFee = (totalCost * platformFeePercent) / 100;
        uint256 sellerProceeds = totalCost - platformFee;
        
        // Transfer stablecoin from buyer to seller
        require(
            stablecoin.transferFrom(buyOrder.user, sellOrder.user, sellerProceeds),
            "Stablecoin transfer failed"
        );
        
        // Transfer credits from seller to buyer
        require(
            carbonCreditToken.transferFrom(
                sellOrder.user,
                buyOrder.user,
                amountToMatch * 10 ** 18
            ),
            "Carbon credit transfer failed"
        );
        
        // Update order fills
        buyOrder.creditAmountFilled += amountToMatch;
        sellOrder.creditAmountFilled += amountToMatch;
        
        // Update prices
        lastPrice = pricePerCredit;
        if (pricePerCredit > highPrice24h) highPrice24h = pricePerCredit;
        if (pricePerCredit < lowPrice24h) lowPrice24h = pricePerCredit;
        
        totalVolumeTraded += amountToMatch;
        
        // Record trade
        tradeHistory.push(Trade({
            buyer: buyOrder.user,
            seller: sellOrder.user,
            creditAmount: amountToMatch,
            pricePerCredit: pricePerCredit,
            totalPrice: totalCost,
            timestamp: block.timestamp,
            buyOrderId: buyOrderId,
            sellOrderId: sellOrderId
        }));
        
        emit OrderFilled(
            buyOrderId,
            buyOrder.user,
            sellOrder.user,
            amountToMatch,
            pricePerCredit
        );
        
        emit TradeExecuted(
            buyOrder.user,
            sellOrder.user,
            amountToMatch,
            totalCost,
            block.timestamp
        );
        
        // Mark as filled if fully matched
        if (buyOrder.creditAmountFilled == buyOrder.creditAmount) {
            buyOrder.status = OrderStatus.FILLED;
        }
        if (sellOrder.creditAmountFilled == sellOrder.creditAmount) {
            sellOrder.status = OrderStatus.FILLED;
        }
    }
    
    /**
     * @dev Cancel an order
     */
    function cancelOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.user == msg.sender, "Not order owner");
        require(order.status == OrderStatus.OPEN, "Order not open");
        
        order.status = OrderStatus.CANCELLED;
        emit OrderCancelled(orderId);
    }
    
    /**
     * @dev Get open orders (buy or sell)
     */
    function getOpenOrders(OrderType orderType) 
        external 
        view 
        returns (Order[] memory openOrders) 
    {
        uint256 count = 0;
        for (uint256 i = 0; i < orderIdCounter; i++) {
            if (orders[i].status == OrderStatus.OPEN && orders[i].orderType == orderType) {
                count++;
            }
        }
        
        openOrders = new Order[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < orderIdCounter; i++) {
            if (orders[i].status == OrderStatus.OPEN && orders[i].orderType == orderType) {
                openOrders[index++] = orders[i];
            }
        }
    }
    
    /**
     * @dev Get market price
     */
    function getCurrentPrice() external view returns (uint256) {
        return lastPrice;
    }
    
    /**
     * @dev Get trade history
     */
    function getTradeHistory(uint256 limit) 
        external 
        view 
        returns (Trade[] memory) 
    {
        uint256 len = tradeHistory.length;
        limit = limit > len ? len : limit;
        
        Trade[] memory recent = new Trade[](limit);
        for (uint256 i = 0; i < limit; i++) {
            recent[i] = tradeHistory[len - 1 - i];
        }
        return recent;
    }
    
    mapping(uint256 => uint256) sellers; // placeholder for seller mapping
}
