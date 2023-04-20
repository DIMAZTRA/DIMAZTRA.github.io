<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template" %>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/responsive/common" %>
<%@ taglib prefix="address" tagdir="/WEB-INF/tags/responsive/address" %>
<%@ taglib prefix="multi-checkout" tagdir="/WEB-INF/tags/responsive/checkout/multi" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="store" tagdir="/WEB-INF/tags/responsive/store" %>
<%@ taglib prefix="formElement" tagdir="/WEB-INF/tags/responsive/formElement" %>
<%@ taglib prefix="multiCheckout" tagdir="/WEB-INF/tags/responsive/checkout/multi"%>

<template:page pageTitle="${pageTitle}" hideHeaderLinks="true">

	<div class="row delivery-address classflex">
	<c:if test="${not empty deliveryMethods}">
		<div class="col-sm-6 order-2">
			<cms:pageSlot position="PromoCartSlot" var="feature">
				<cms:component component="${feature}" element="div" class="yComponentWrapper"/>
			</cms:pageSlot>
			<div class="checkout-steps ${cssClass}">
				<a class="step-head js-checkout-step active" id="1">
					<div class="title"><spring:theme code="checkout.multi.deliveryMethod"/></div>
				</a>
				<div class="step-body">
				<ycommerce:testId code="checkoutStepSingle">
					<c:set value="${request.contextPath}/checkout/multi/confirm-order/confirmOrder" var="confirmOrder"/>
				<div class="checkout-shipping">
                    <multi-checkout:shipmentItems cartData="${cartData}" showDeliveryAddress="false"/>
                    <div class="checkout-indent" id="selectDeliveryMethod">
						<div class="form-group">
							<multi-checkout:deliveryMethodCheckbox deliveryMethods="${deliveryMethods}" selectedDeliveryMethodId="${cartData.deliveryMode.code}"/>
						</div>
                    </div>
					<form:form id="belwestConfirmOrderForm" class="select-delivery-address" action="${confirmOrder}" method="post" modelAttribute="confirmOrderForm">
						<div class="checkout-indent" id="selectPickUpDiv" style="display: ${fn:contains(cartData.deliveryMode.code, 'pickup') eq true ? 'block' : 'none'}  ">						
                            <br>                   
								<form:select id="pickupStoreSelect" path="pickupPOSForm.pickupPOS" name="selectedPosCode" class="selectpicker" data-size="10" data-live-search="true">
                                    <form:option disabled="true" value="" selected = "true">
										<spring:theme code="checkout.summary.deliveryMode.pickup.store.select"></spring:theme>
									</form:option>
									<c:forEach var="pickupPOS" items="${pickupPOSes}">
										<c:set var="disabled" value="false"/>
										<c:choose>
												<c:when test="${requestScope.disabledRegion}">
													<c:set var="disabled" value="false"/>
													<c:set var="style" value="checkout-icon__null"/>
												</c:when>
												<c:when test="${pickupPOS.percentAvailable == 100}">
													<c:set var="disabled" value="false"/>
													<c:set var="style" value="checkout-icon__shoes-available"/>
                                                    <c:set var="title" value="В наличии"/>
												</c:when>
												<c:when test="${pickupPOS.percentAvailable == 0}">
													<c:set var="disabled" value="true"/>
													<c:set var="style" value="checkout-icon__shoes-notavailable"/>
                                                    <c:set var="title" value="Нет в наличии"/>
												</c:when>
												<c:otherwise>
													<c:set var="style" value="checkout-icon__shoes-partiallyavailable"/>
                                                    <c:set var="title" value="Частично"/>
												</c:otherwise>
										</c:choose>
										<form:option data-icon="${style}" data-title="${title}" value="${pickupPOS.name}" disabled="${disabled}" >
											<c:out value="${pickupPOS.address.town}, ${pickupPOS.address.line1} "/> 
										</form:option>
									</c:forEach>
                                </form:select>
                            

								<div class="checkout-indent">
									<div id="belwestSelectedPosAddress"></div>
								</div>
                            <multi-checkout:selectedPickupStoreTemplate/>
						</div>
						
						<div class="checkout-indent" id="selectPickUpPointDiv" style="display: ${fn:contains(cartData.deliveryMode.code, 'pick-up-point') eq true ? 'block' : 'none'}  ">
                            <br>
                                <form:select id="pickupPointSelect" path="pickupPUPForm.pickupPUP" name="selectedPupCode" class="selectpicker" data-size="10" data-live-search="true">
                                    <form:option disabled="true" value="" selected = "true">
										<spring:theme code="checkout.summary.deliveryMode.pickup.point.select"></spring:theme>
									</form:option>
									<c:forEach var="pickupPUP" items="${pickupPUPes}">
										<form:option data-icon="checkout-icon__null" data-title="${title}" value="${pickupPUP.name}" >
											<c:out value="${pickupPUP.address.town}, ${pickupPUP.address.line1} "/> 
										</form:option>
									</c:forEach>
                                </form:select>
                            

								<div class="checkout-indent">
									<div id="belwestSelectedPupAddress"></div>
								</div>
                            <multi-checkout:selectedPickupPointTemplate/>
						</div>

						<div class="checkout-indent addressDelivery" id="addressDelivery" style="display: ${fn:contains(cartData.deliveryMode.code, 'standard-gross') eq true ? 'block' : 'none'}  ">					
							<address:addressFormCheckoutSelector supportedCountries="${countries}" regions="${regions}" country="${country}"/>
                        </div>	
														
                </div>
				<a class="step-head js-checkout-step active" id="2">
					<div class="title"><spring:theme code="checkout.multi.paymentMethod"/></div>
				</a>
				<div class="checkout-paymentmethod">
                    <div class="checkout-indent">
                        <div class="control">                                    
                            <label class="control-label">
                                <form:errors path="belwestPaymentMethodForm.paymentType"/>
                            </label>
                            <div class="form-group">
								<multi-checkout:paymentMethodCheckbox/>
							</div>
					    </div>
						<multiCheckout:paymentCard/>                        
                        <div class="checkout-indent mb20">
                            <cms:pageSlot position="PaymentCartSlot" var="feature">
								<cms:component component="${feature}" element="div" class="yComponentWrapper"/>
                            </cms:pageSlot>
                        </div>
												
					</div>
				</div>
				<a class="step-head js-checkout-step active" id="3">
					<div class="title"><spring:theme code="checkout.multi.confirmOrder"/></div>
				</a>
				<div class="place-order-form hidden-xs">				
					<form:textarea id="comment" name="comment"  path="BelwestPlaceOrderForm.comment" class="form-control mt20 mb20" placeholder="Комментарий к заказу"></form:textarea>	
					
					<div class="checkbox">
                        <label class="container-checkbox pl0 pb20"><spring:theme code="checkout.summary.placeOrder.readTermsAndConditions" arguments="${getTermsAndConditionsUrl}" text="Terms and Conditions"/></label>
                    </div>
				</div>
				</form:form>
				
							 <button id="customOrderConfirmSubmit" type="button" onclick="customOrderConfirmSubmit"
                        class="btn btn-primary btn-place-order btn-block checkout-next js-block-after-one-click"><spring:theme
                        code="checkout.summary.placeOrder" text="Next"/></button>
				</ycommerce:testId>
				   
			</div>
            <div id="addressbook">
                <c:forEach items="${deliveryAddresses}" var="deliveryAddress" varStatus="status">
                    <div class="addressEntry">
                        <ul>
                            <li>
                                <strong><span class="bold">${fn:escapeXml(deliveryAddress.lastName)}&nbsp;${fn:escapeXml(deliveryAddress.firstName)}&nbsp;
                                           ${fn:escapeXml(deliveryAddress.middleName)}
                                        </span></strong>
                                <br>
                                <br>
                                    ${fn:escapeXml(deliveryAddress.line1)}&nbsp;
                                    ${fn:escapeXml(deliveryAddress.line2)}
                                <br>
                                    ${fn:escapeXml(deliveryAddress.town)}
                                <c:if test="${not empty deliveryAddress.region.name}">
                                    &nbsp;${fn:escapeXml(deliveryAddress.region.name)}
                                </c:if>
                                <br>
                                    ${fn:escapeXml(deliveryAddress.country.name)}
                                <br>
                                    ${fn:escapeXml(deliveryAddress.postalCode)}
                            </li>
                        </ul>
                        <button type="button" class="btn btn-primary btn-block btn-center select-delivery-customer-address" id="${deliveryAddress.id}">
                            <spring:theme code="checkout.multi.deliveryAddress.select" text="Use this Address"/>
                        </button>
                    </div>
                </c:forEach>
            </div>	
		</div>
		</div>
		<div class="col-sm-6 order-1">
			<multi-checkout:checkoutOrderDetails cartData="${cartData}" showDeliveryAddress="false" showPaymentInfo="false" showTaxEstimate="true" showTax="true"/>
		</div> 
</c:if>
</div>
<div class="row delivery-address-icon">
<multi-checkout:checkoutFeatures />
</div>
</template:page>

<script type="text/javascript">


$(document).ready(function() {
	if ($('[id=paymentType]:checked').val() == 'ONLINE')
	{		
            $('.select-online-pay').show();
            $('#payment-info').show();
            $('#payment-info-card').hide();
            
	}
	
	 $('[id=paymentType]').change(function () {
        if (this.value == 'ON_RECEIPT') {
            $('.select-online-pay').hide();
            $('#payment-info').hide();
            $('#payment-info-card').show();
            
        }
        else if (this.value == 'ONLINE') {
            $('.select-online-pay').show();
            $('#payment-info').show();
            $('#payment-info-card').hide();
            
        }
    });

});

</script>

