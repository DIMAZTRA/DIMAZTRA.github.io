ACC.checkout = {
	_autoload: [
		"bindCheckO",
		"bindSavedPayments"
	],

	bindSavedPayments: function () {
		$(document).on("click", ".js-saved-payments", function (e) {
			e.preventDefault();
			var title = $("#savedpaymentstitle").html();
			$.colorbox({
				href: "#savedpaymentsbody",
				inline: true,
				maxWidth: "100%",
				opacity: 0.7,
				//width:"320px",
				title: title,
				close: '<span class="glyphicon glyphicon-remove"></span>',
				onComplete: function () {
				}
			});
		})
	},
	validationGuestEmail: function () {
		var orginalEmail = $(".guestEmail").val();
		var r = /^[\w\.\d-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (r.test(orginalEmail)) {
			$(".guestCheckoutBtn").removeAttr("disabled");
		} else {
			$(".guestCheckoutBtn").attr("disabled", "disabled");
		}
	},
	bindCheckO: function () {
		var cartEntriesError = false;
		// Alternative checkout flows options
		$('.doFlowSelectedChange').change(function () {
			if ('multistep-pci' == $('#selectAltCheckoutFlow').val()) {
				$('#selectPciOption').show();
			}
			else {
				$('#selectPciOption').hide();
			}
		});
		/*$('#address\\.townCity').change(function ()
		{
			ACC.checkoutaddress.updateDelivery();
		});*/

		$("#pickupStoreSelect").change(function () {
			ACC.checkoutaddress.updateDelivery();
		});
		$("#pickupPointSelect").change(function () {
			ACC.checkoutaddress.updateDelivery();
		});
		$('.js-continue-shopping-button').click(function () {
			var checkoutUrl = $(this).data("continueShoppingUrl");
			window.location = checkoutUrl;
		});
		$('.js-create-quote-button').click(function () {
			$(this).prop("disabled", true);
			var createQuoteUrl = $(this).data("createQuoteUrl");
			window.location = createQuoteUrl;
		});
		$('.expressCheckoutButton').click(function () {
			document.getElementById("expressCheckoutCheckbox").checked = true;
		});
		ACC.checkout.validationGuestEmail();
		$(document).on("input", ".guestEmail", function () {
			ACC.checkout.validationGuestEmail();
		});
		$(document).on("click", ".select-delivery-customer-address", function (e) {
			var optionsAddress = {
				url: ACC.config.encodedContextPath + "/checkout/multi/confirm-order/selectAddress",
				type: 'GET',
				data: { selectedAddressCode: e.target.id, checkoutToken: ACC.config.checkoutToken },
				success: function (jsonData, textStatus, jqXHR) {
					if (jsonData != null) {
						ACC.checkoutaddress.fillDeliveryAddress(jsonData);
						var deliveryMethod = $(".deliveryMethod-list:checked").val();
						let num=jsonData.phone
						if (ACC.config.siteResourcePath.indexOf('by')!= -1 && jsonData.phone.length==9){
						num=num.replace(/^(\d{2})/g,"($1) ").replace(/(\d{3})(\d{2})(\d{2})/g,"$1-$2-$3");
						$('.mobile_number').val(num) 
						}else if(ACC.config.siteResourcePath.indexOf('ru')!= -1 && jsonData.phone.length==10){
						num=num.replace(/^(\d{3})/g,"($1) ").replace(/(\d{3})(\d{2})(\d{2})/g,"$1-$2-$3"); 
						$('.mobile_number').val(num)
						}
						ACC.checkoutaddress.updateDelieryTimeData(deliveryMethod, jsonData.cityId, '');
						$(this).colorbox.close();
						
					}
				}
			};
			$.ajax(optionsAddress);
			
		});

		$('.js-continue-checkout-button').click(function () {
			var checkoutUrl = $(this).data("checkoutUrl");
			cartEntriesError = ACC.pickupinstore.validatePickupinStoreCartEntires();
			if (!cartEntriesError) {
				var expressCheckoutObject = $('.express-checkout-checkbox');
				if (expressCheckoutObject.is(":checked")) {
					window.location = expressCheckoutObject.data("expressCheckoutUrl");
				}
				else {
					var flow = $('#selectAltCheckoutFlow').val();
					if (flow == undefined || flow == '' || flow == 'select-checkout') {
						// No alternate flow specified, fallback to default behaviour
						window.location = checkoutUrl;
					}
					else {
						// Fix multistep-pci flow
						if ('multistep-pci' == flow) {
							flow = 'multistep';
						}
						var pci = $('#selectPciOption').val();
						// Build up the redirect URL
						var redirectUrl = checkoutUrl + '/select-flow?flow=' + flow + '&pci=' + pci;
						window.location = redirectUrl;
					}
				}
			}
			return false;
		});
	}
};
//Start checkoutaddress.js
ACC.checkoutaddress = {
	spinner: $("<img src='" + ACC.config.commonResourcePath + "/images/spinner.gif' />"),
	addressID: '',
	freeDeliveryConst: 'FREE',
	showAddressBook: function () {
		$(document).on("click", "#viewAddressBook", function () {
			var data = $("#savedAddressListHolder").html();
			$.colorbox({
				height: false,
				html: data,
				onComplete: function () {
					$(this).colorbox.resize();
				}
			});
		})
	},
	showRemoveAddressConfirmation: function () {
		$(document).on("click", ".removeAddressButton", function () {
			var addressId = $(this).data("addressId");
			$.colorbox({
				inline: true,
				height: false,
				href: "#popup_confirm_address_removal_" + addressId,
				onComplete: function () {
					$(this).colorbox.resize();
				}
			});
		})
	},
	changeVisibilityDiv: function () {

		if ($(".deliveryMethod-list:checked").val() != null) {
			if ($(".deliveryMethod-list:checked").val().indexOf("pickup") == 0) {
				$("#addressDelivery").hide();
				$("#selectPickUpDiv").show();
				$("#selectPickUpPointDiv").hide();
				$("#deliveryMessCart").hide();
			} else if ($(".deliveryMethod-list:checked").val().indexOf("standard-gross") == 0) {
				$("#addressDelivery").show();
				$("#selectPickUpDiv").hide();
				$("#selectPickUpPointDiv").hide();
				$("#deliveryMessCart").show();
				ACC.address.bindDeliveryCityAutoComplete();
			} else if ($(".deliveryMethod-list:checked").val().indexOf("pick-up-point") == 0) {
				$("#addressDelivery").hide();
				$("#selectPickUpDiv").hide();
				$("#selectPickUpPointDiv").show();
				$("#deliveryMessCart").show();
			}
		}
		if($(".checkmark-radio.pickup").length==0){
			$("#selectPickUpDiv").hide()
		}
		if($(".checkmark-radio.delivery-dpd").length==0){
			$("#selectPickUpPointDiv").hide()
		}
		
		$("#selectDeliveryMethod").find("input[type='radio']").prop("disabled", false);
	},
	changePriceBasedOnDeliveryType: function (deliveryMode) {
		$.ajax({
			loader: true,
			accept: "application/json",
			type: "GET",
			url: "changePriceBasedOnDelivery",
			data: { delivery_param: deliveryMode },
			success: function success(data) {
				ACC.checkoutaddress.fillPricesAfterDeliveryTypeChanged(data);
			},
			error: function () {
				console.error("Error change price based on delivery");
			}
		});
	},
	fillPricesAfterDeliveryTypeChanged: function (data) {
		//fill order totals
		$('#subTotalD').html(data.subTotal.formattedValue);
		if (data.quoteDiscounts && data.quoteDiscounts.value) {
			$('#quoteDiscountsD').html(data.quoteDiscounts.formattedValue);
			$("#quoteDiscountsSection").show();
		} else {
			$("#quoteDiscountsSection").hide();
		}
		if (data.orderDiscounts && data.orderDiscounts.value) {
			$('#orderDiscountsD').html(data.orderDiscounts.formattedValue);
			$('#orderDiscountsSection').show();
		} else {
			$('#orderDiscountsSection').hide();
		}
		if (data.totalDiscounts && data.totalDiscounts.value) {
			$('#totalDiscountsD').html(data.totalDiscounts.formattedValue);
			$('#totalDiscountsSection').show();
		}
		else {
			$('#totalDiscountsSection').hide();
		}

		if (!jQuery.isEmptyObject(data.deliveryCost)) {
			var costValue = costValue = { price: data.deliveryCost.formattedValue };
			$('#deliveryCostSection').replaceWith($('#deliveryPriceTemplate').tmpl(costValue));
			$('#deliveryCostSection').show();
		} else {
			$('#deliveryCostSection').hide();
		}

		if (data.totalPriceWithTax) {
			$('#totalPriceWithTaxD').html(data.totalPriceWithTax.formattedValue);
		}

		$('#totalPriceD').html(data.totalPrice.formattedValue);

		var orderEntriesData = data.entries;

		var indexPrice = 0;
		var totalItemArray = $(".item__quantity__total").toArray();
		var priceArray = $(".item__list--item").toArray();

	},
	showStoreInfo: function () {
		var selectedValue = $("#pickupStoreSelect option:selected").val();
		$.getJSON("/en/checkout/store/pickupStore/" + selectedValue, function (posData) {
			if (posData != undefined) {
				$('#belwestSelectedPosAddress').replaceWith($('#selectedPickupStoreTemplate').tmpl(posData));
			}
		});
	},
	showPointInfo: function () {
		var selectedValue = $("#pickupPointSelect option:selected").val();
		$.getJSON("/en/checkout/store/pickupPoint/" + selectedValue, function (posData) {
			if (posData != undefined) {
				$('#belwestSelectedPupAddress').replaceWith($('#selectedPickupPointTemplate').tmpl(posData));
			}
		});
	},
	bindActions: function () {
		$('#pickupStoreSelect').change(function () {
			ACC.checkoutaddress.showStoreInfo();
		});
		$('#pickupPointSelect').change(function () {
			ACC.checkoutaddress.showPointInfo();
		});
		$('.deliveryMethod-list').on('change', function () {
			$('.deliveryMethod-list').not(this).prop('checked', false);
			var deliveryMode = $(".deliveryMethod-list:checked").val();
			ACC.checkoutaddress.changeVisibilityDiv();
			ACC.checkoutaddress.updateDelivery();
		});



	},

	updateDeliveryTime: function (addressData) {
		var optionsUpdateTime = {
			loader: true,
			url: ACC.config.encodedContextPath + "/checkout/multi/confirm-order/updateDeliveryTime",
			data: addressData,
			type: 'GET',
			success: function (jsonData) {
				ACC.checkoutaddress.fillDeliveryTime(jsonData);
			}
		};
		$.ajax(optionsUpdateTime);
	},

	updateSelectedShop: function (addressData) {
		var optionsUpdateShop = {
			loader: true,
			url: ACC.config.encodedContextPath + "/checkout/multi/confirm-order/updateSelectedShop",
			data: addressData,
			type: 'GET',
			success: function (jsonData) {
				ACC.checkoutaddress.updateCartInfo(jsonData);
			}
		};
		$.ajax(optionsUpdateShop);
	},
	updateCartInfo: function (jsonData) {
		var orderEntriesData = jsonData.entries;
		var priceArray = $(".item__list--item").toArray();
		var deliveryArray = $(".item__list--deliveryTime");
		for (var i = 0; i < priceArray.length; i++) {
			if (!orderEntriesData[i].availableInSelectedStore) {
				$(".item__list--item")[i].style.opacity = "0.5";
			} else {
				$(".item__list--item")[i].style.opacity = "1";
			}
		}
	},
	fillDeliveryTime: function (jsonData) {

		if (jsonData.cityDeliveryTimeData != null) {
			var delvVal = jsonData.cityDeliveryTimeData.formattedValue;
			var delvSpa = $('.deliveryTime');

			if (delvSpa.length != 0) {
				var delivery = '<span class="deliveryTime">' + delvVal + "</span>";
				delvSpa.replaceWith(delivery);
			}
		} else {
			var delivery = '<span class="deliveryTime">' + "</span>";
			$('.deliveryTime').replaceWith(delivery);
		}

		var orderEntriesData = jsonData.entryDeliveryTimeList;
		if (orderEntriesData != null) {
			var deliveryArray = $(".item__list--deliveryTime");
			var deliveryTodayArray = $(".item__list--delivery-todayTime");

			if (deliveryArray.length != 0) {
				deliveryTodayArray.each(function (index) {
					if (orderEntriesData[index] != null && orderEntriesData[index].deliveryTime != null && orderEntriesData[index].deliveryTime == 0) {
						var l = $(this).find('#deliveryTodayLabel');
						l.text(orderEntriesData[index].formattedValue);
						$(this).show();
					} else if (orderEntriesData[index] != null && orderEntriesData[index].deliveryTime != null && orderEntriesData[index].deliveryTime == -1) {
						var l = $(this).find('#deliveryTodayLabel');
						l.text(orderEntriesData[index].formattedValue);
						$(this).show();
					} else {
						$(this).hide();
					}
				});
			}
			if (deliveryArray.length != 0) {
				deliveryArray.each(function (index) {
					if (orderEntriesData[index] != null && orderEntriesData[index].deliveryTime > 0) {
						var l = $(this).find('#deliveryTimeLabel');
						l.text(orderEntriesData[index].formattedValue);
						$(this).show();
					} else {
						$(this).hide();
					}
				});
			}
		}
	},
	fillDeliveryAddress: function (jsonData) {
		document.getElementById("address.surname").value = jsonData.lastName;
		document.getElementById("address.firstName").value = jsonData.firstName;
		document.getElementById("address.middleName").value = jsonData.middleName;
		document.getElementById("address.townCity").value = jsonData.town;
		document.getElementById("address.cityId").value = jsonData.cityId;
		document.getElementById("address.line1").value = jsonData.line1;
		document.getElementById("address.line2").value = jsonData.line2;
		document.getElementById("address.block").value = jsonData.block;
		document.getElementById("address.appartment").value = jsonData.appartment;
		document.getElementById("address.phone").value = jsonData.phone;
		document.getElementById("addressForm.addressId").value = jsonData.id;
	},
	updateDelivery: function () {

		var deliveryMethod = $(".deliveryMethod-list:checked").val();
		var cityId = '';
		var selStore = '';

		if (typeof deliveryMethod !== 'undefined') {
			if (deliveryMethod.indexOf("pickup") == 0) {
				selStore = $("#pickupStoreSelect option:selected").val();
				cityId = "";
			} else if (deliveryMethod.indexOf("standard-gross") == 0) {
				cityId = $('#address\\.cityId').val();
				selStore = '';
			}
			else if (deliveryMethod.indexOf("pick-up-point") == 0) {
				selStore = $("#pickupPointSelect option:selected").val();
				cityId = "";
			}
		}
		else {
			cityId = $('#address\\.cityId').val();
		}

		ACC.checkoutaddress.updateDelieryTimeData(deliveryMethod, cityId, selStore);
	},
	updateDelieryTimeData: function (deliveryMethod, cityId, selStore) {
		if (cityId.length != 0 || selStore.length != 0) {
			var options = {
				loader: true,
				url: ACC.config.encodedContextPath + "/checkout/multi/confirm-order/updateDeliveryMethod",
				data: { deliveryMethod: deliveryMethod, cityId: cityId, pos: selStore, checkoutToken: ACC.config.checkoutToken },
				type: 'GET',
				success: function (jsonData, textStatus, jqXHR) {
					if (jqXHR.status == '204') {
						window.location.replace("/cart");
					}
					else {
						ACC.checkoutaddress.fillPricesAfterDeliveryTypeChanged(jsonData);
						var deliveryReq;
						if (deliveryMethod.indexOf("pickup") == 0 || deliveryMethod.indexOf("pick-up-point") == 0) {
							deliveryReq = { deliveryMethod: deliveryMethod, pos: selStore, checkoutToken: ACC.config.checkoutToken };
							ACC.checkoutaddress.updateSelectedShop(deliveryReq);
						}
						else if (deliveryMethod.indexOf("standard-gross") == 0) {
							deliveryReq = { deliveryMethod: deliveryMethod, pos: cityId, checkoutToken: ACC.config.checkoutToken };
						}
						ACC.checkoutaddress.updateDeliveryTime(deliveryReq);
					}
				},
			};
			$.ajax(options);
		} else {
			ACC.checkoutaddress.changePriceBasedOnDeliveryType(deliveryMethod);
			$('.deliveryTime').replaceWith("<span class=\"deliveryTime\"/>");
		}
	}
}
// Address Verification
$(document).ready(function () {
	with (ACC.checkoutaddress) {
		var selectedValue = $("#pickupStoreSelect option:selected").val();
		if (selectedValue) {
			ACC.checkoutaddress.showStoreInfo();
		}

		var selectedValuePuPoint = $("#pickupPointSelect option:selected").val();
		if (selectedValuePuPoint) {
			ACC.checkoutaddress.showPointInfo();
		}

		showAddressBook();
		showRemoveAddressConfirmation();
		bindActions();
		changeVisibilityDiv();

	}
});
//End checkoutaddress.js

//Start checkoutsteps.js
ACC.checkoutsteps = {
	_autoload: [
		"permeateLinks"
	],
	permeateLinks: function () {
		$(document).on("click", ".js-checkout-step", function (e) {
			e.preventDefault();
			var clickedElement = $(this).attr("id");
			var currentElement = $('#activeCheckoutStepNumber').val();
			if (currentElement > clickedElement) {
				window.location = $(this).closest("a").attr("href")
			}
		})
	}
};
//End checkoutsteps.js
